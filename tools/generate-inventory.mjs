import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";
import generatorModule from "@babel/generator";
const traverse = traverseModule.default,
  generate = generatorModule.default;
const walk = (directory) =>
  fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory()
        ? walk(path.join(directory, e.name))
        : [path.join(directory, e.name)],
    );
const files = walk("src").filter(
  (p) => p.endsWith(".ts") && !p.endsWith(".d.ts"),
);
const graph = {},
  stages = [],
  texts = [],
  audio = [];
const fields = (node) =>
  Object.fromEntries(
    node.properties
      .filter((p) => p.type === "ObjectProperty")
      .map((p) => [p.key.name || p.key.value, generate(p.value).code]),
  );
for (const file of files) {
  const ast = parse(fs.readFileSync(file, "utf8"), {
    sourceType: "module",
    plugins: ["typescript"],
  });
  const dependencies = [];
  traverse(ast, {
    ImportDeclaration(p) {
      const value = p.node.source.value;
      if (value.startsWith(".")) {
        let target = path.normalize(
          path.join(path.dirname(file), value.split("?")[0]),
        );
        if (!path.extname(target)) target += ".ts";
        if (target.endsWith(".ts")) dependencies.push(target);
      }
    },
    ObjectExpression(p) {
      const data = fields(p.node);
      if (data.id && /^`(?:gate|stage)/.test(data.id))
        stages.push({
          file,
          line: p.node.loc.start.line,
          ...Object.fromEntries(
            Object.entries(data).filter(
              ([k]) =>
                ![
                  "enter",
                  "scrub",
                  "update",
                  "resize",
                  "teardown",
                  "holdTrigger",
                ].includes(k),
            ),
          ),
        });
      if (data.appearAt)
        texts.push({ file, line: p.node.loc.start.line, ...data });
    },
    VariableDeclarator(p) {
      if (
        p.node.id.name === "audioTracks" &&
        p.node.init.type === "ObjectExpression"
      )
        for (const track of p.node.init.properties)
          audio.push({
            id: track.key.name || track.key.value,
            ...fields(track.value),
          });
    },
  });
  graph[file] = [...new Set(dependencies)].sort();
}
const cycles = [],
  done = new Set(),
  active = [];
function visit(key) {
  if (active.includes(key)) {
    cycles.push([...active.slice(active.indexOf(key)), key]);
    return;
  }
  if (done.has(key)) return;
  active.push(key);
  for (const dep of graph[key]) if (graph[dep]) visit(dep);
  active.pop();
  done.add(key);
}
for (const key of Object.keys(graph)) visit(key);
fs.writeFileSync(
  "research/architecture.json",
  JSON.stringify(
    {
      moduleCount: files.length,
      cycles,
      modules: Object.entries(graph).map(([file, dependencies]) => ({
        file,
        dependencies,
      })),
    },
    null,
    2,
  ) + "\n",
);
const shaders = JSON.parse(
  fs.readFileSync("research/shader-manifest.json"),
).map((item) => {
  const source = fs.readFileSync("src/shaders/" + item.name, "utf8");
  return {
    ...item,
    sha256: crypto.createHash("sha256").update(source).digest("hex"),
    uniforms: [
      ...source.matchAll(/\buniform\s+(\w+)\s+(\w+)(?:\[(\d+)\])?/g),
    ].map((m) => ({
      type: m[1],
      name: m[2],
      ...(m[3] ? { length: Number(m[3]) } : {}),
    })),
  };
});
fs.writeFileSync(
  "research/behavior-inventory.json",
  JSON.stringify({ stages, texts, audio, shaders }, null, 2) + "\n",
);
console.log(
  `${files.length} TypeScript modules, ${cycles.length} dependency cycles, ${shaders.length} shaders, ${texts.length} text configurations, ${audio.length} audio tracks.`,
);
