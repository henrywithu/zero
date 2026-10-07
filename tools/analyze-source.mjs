import fs from "node:fs";
import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";
const traverse = traverseModule.default;
const source = fs.readFileSync("research/original/main.js", "utf8");
const ast = parse(source, { sourceType: "module" });
const application = (n) =>
  (n.loc.start.line >= 32773 && n.loc.start.line < 33670) ||
  (n.loc.start.line >= 35541 &&
    !(n.loc.start.line >= 47611 && n.loc.start.line < 48276) &&
    !(n.loc.start.line >= 50385 && n.loc.start.line < 50892));
let program;
traverse(ast, {
  Program(p) {
    program = p;
  },
});
const refs = new Set();
traverse(ast, {
  ReferencedIdentifier(p) {
    if (application(p.node)) {
      const b = p.scope.getBinding(p.node.name);
      if (b && b.scope === program.scope && !application(b.path.node))
        refs.add(p.node.name);
    }
  },
});
for (const name of [...refs]) {
  const b = program.scope.getBinding(name);
  console.log(
    name,
    b.path.node.loc.start.line,
    source
      .slice(
        b.path.node.start,
        Math.min(b.path.node.end, b.path.node.start + 180),
      )
      .replace(/\n/g, " "),
  );
}
fs.writeFileSync("research/external-bindings.json", JSON.stringify([...refs]));
fs.writeFileSync(
  "/tmp/zero-app-boundaries.json",
  JSON.stringify(
    ast.program.body.map((n) => ({
      type: n.type,
      line: n.loc.start.line,
      end: n.loc.end.line,
    })),
  ),
);
const paths = new Set();
traverse(ast, {
  TemplateLiteral(p) {
    if (p.node.expressions.length === 0) {
      let v = p.node.quasis[0].value.cooked;
      if (/^(\.?\/?assets\/|\/vendor\/)/.test(v))
        paths.add(v.replace(/^\.?\//, ""));
    }
  },
  StringLiteral(p) {
    if (/^(\.?\/?assets\/|\/vendor\/)/.test(p.node.value))
      paths.add(p.node.value.replace(/^\.?\//, ""));
  },
});
fs.writeFileSync(
  "research/asset-paths.json",
  JSON.stringify(
    [...paths].filter((p) => /\.[a-z0-9]{2,5}$/i.test(p)),
    null,
    2,
  ),
);
