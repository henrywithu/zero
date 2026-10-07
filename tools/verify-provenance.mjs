import fs from "node:fs";
import crypto from "node:crypto";
import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";
import generatorModule from "@babel/generator";
import assert from "node:assert/strict";
const traverse = traverseModule.default,
  generate = generatorModule.default;
const digest = (data) => crypto.createHash("sha256").update(data).digest("hex");
const assets = [
  ...JSON.parse(fs.readFileSync("research/asset-manifest.json")),
  ...JSON.parse(fs.readFileSync("research/font-manifest.json")),
];
// Intentional identity replacements; every scene/audio/font asset remains hash-checked.
const brandOverrides = new Set([
  'assets/brand/apple-touch-icon.png', 'assets/brand/favicon.png',
  'assets/brand/favicon.svg', 'assets/brand/nav_logo.svg',
  'assets/brand/nav_logo_white.svg', 'assets/brand/og_image.jpg',
  'assets/ui/zero_icon.jpg',
]);
for (const item of assets) {
  if (brandOverrides.has(item.path)) continue;
  if (item.error) throw Error(`${item.path}: ${item.error}`);
  if (digest(fs.readFileSync("public/" + item.path)) !== item.sha256)
    throw Error("Asset changed: " + item.path);
}
const archives = JSON.parse(fs.readFileSync("research/source-manifest.json"));
for (const item of archives) {
  assert.equal(
    digest(fs.readFileSync(item.file)),
    item.archivedSha256,
    "Source archive changed: " + item.file,
  );
}
const ast = parse(fs.readFileSync("research/original/main.js", "utf8"), {
  sourceType: "module",
});
const originals = new Map();
traverse(ast, {
  TemplateLiteral(p) {
    originals.set(p.node.loc.start.line, {
      source:
        p.node.quasis
          .map(
            (q, i) =>
              q.value.cooked +
              (i < p.node.expressions.length ? `__ZERO_PARAM_${i}__` : ""),
          )
          .join("")
          .trim() + "\n",
      parameters: p.node.expressions.map((e) => generate(e).code),
    });
  },
});
const shaders = JSON.parse(fs.readFileSync("research/shader-manifest.json"));
for (const item of shaders) {
  const original = originals.get(item.line);
  assert.equal(
    fs.readFileSync("src/shaders/" + item.name, "utf8"),
    original?.source,
    "Shader changed: " + item.name,
  );
  assert.deepEqual(
    item.parameters ?? [],
    original.parameters,
    "Shader interpolation changed: " + item.name,
  );
}
console.log(
  `Verified ${assets.length - brandOverrides.size} unchanged original assets and ${shaders.length} original shader sources.`,
);
