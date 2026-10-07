// One-time extraction of remaining Three.js injection chunks and the
// parameterized petal vertex program. These are source migrations, not builds.
import fs from "node:fs";
import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";
import generatorModule from "@babel/generator";
const traverse = traverseModule.default,
  generate = generatorModule.default;
const archive = parse(fs.readFileSync("research/original/main.js", "utf8"), {
  sourceType: "module",
});
function templateSource(node) {
  return (
    node.quasis
      .map(
        (q, i) =>
          q.value.cooked +
          (i < node.expressions.length ? `__ZERO_PARAM_${i}__` : ""),
      )
      .join("")
      .trim() + "\n"
  );
}
const originals = new Map();
traverse(archive, {
  TemplateLiteral(p) {
    originals.set(templateSource(p.node), p.node.loc.start.line);
  },
});
const manifest = JSON.parse(fs.readFileSync("research/shader-manifest.json"));
const files = [
  "src/models/CoinRing.ts",
  "src/models/HandsModel.ts",
  "src/components/OrigamiCertificate.ts",
  "src/stages/GateThreeToFour.ts",
  "src/stages/MapStages.ts",
];
for (const file of files) {
  let source = fs.readFileSync(file, "utf8"),
    imports = [],
    edits = [],
    needsInterpolation = false;
  const ast = parse(source, { sourceType: "module", plugins: ["typescript"] });
  traverse(ast, {
    TemplateLiteral(p) {
      const normalized = templateSource(p.node);
      if (
        !/\b(?:uniform|varying|gl_Position|totalEmissiveRadiance)\b/.test(
          normalized,
        ) &&
        !(normalized.startsWith("#include") && normalized.trim().includes("\n"))
      )
        return;
      const n = manifest.length + 1,
        binding = `extractedShader${n}`;
      const component = file.replace(/^src\//, "").replace(/\.ts$/, "");
      const type = /gl_Position/.test(normalized) ? "vert" : "chunk";
      const name = `${component.split("/").pop()}-extracted-${n}.${type}.glsl`;
      const line = originals.get(normalized);
      if (!line) throw Error(`Missing original template for ${name}`);
      fs.writeFileSync(`src/shaders/${name}`, normalized);
      imports.push(`import ${binding} from '../shaders/${name}?raw';`);
      let replacement = binding;
      if (p.node.expressions.length) {
        needsInterpolation = true;
        replacement = `interpolateShader(${binding}, {${p.node.expressions.map((e, i) => `__ZERO_PARAM_${i}__: ${generate(e).code}`).join(",")}})`;
      }
      edits.push({ start: p.node.start, end: p.node.end, replacement });
      manifest.push({
        name,
        binding,
        component,
        line,
        type,
        parameters: p.node.expressions.map((e) => generate(e).code),
      });
    },
  });
  for (const e of edits.sort((a, b) => b.start - a.start))
    source = source.slice(0, e.start) + e.replacement + source.slice(e.end);
  if (needsInterpolation)
    imports.push(
      `import { interpolateShader } from '../rendering/ShaderMaterial';`,
    );
  if (imports.length)
    fs.writeFileSync(file, imports.join("\n") + "\n" + source);
}
fs.writeFileSync(
  "research/shader-manifest.json",
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log(
  "Isolated",
  manifest.length,
  "original shader programs and injection chunks.",
);
