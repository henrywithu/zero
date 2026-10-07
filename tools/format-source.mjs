/** Expand extracted comma expressions into readable statements without changing evaluation order. */
import fs from "node:fs";
import path from "node:path";
import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";
import generateModule from "@babel/generator";
const traverse = traverseModule.default,
  generate = generateModule.default;
function files(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory()
        ? files(path.join(dir, e.name))
        : [path.join(dir, e.name)],
    );
}
for (const file of files("src").filter(
  (p) => p.endsWith(".ts") && !p.endsWith(".d.ts"),
)) {
  const code = fs.readFileSync(file, "utf8");
  if (!code.includes("Recovered")) continue;
  const ast = parse(code, { sourceType: "module", plugins: ["typescript"] });
  traverse(ast, {
    ExpressionStatement(p) {
      if (p.node.expression.type === "SequenceExpression")
        p.replaceWithMultiple(
          p.node.expression.expressions.map((expression) => ({
            type: "ExpressionStatement",
            expression,
          })),
        );
    },
    ReturnStatement(p) {
      if (p.node.argument?.type === "SequenceExpression") {
        const expressions = [...p.node.argument.expressions];
        const last = expressions.pop();
        p.replaceWithMultiple([
          ...expressions.map((expression) => ({
            type: "ExpressionStatement",
            expression,
          })),
          { type: "ReturnStatement", argument: last },
        ]);
      }
    },
  });
  fs.writeFileSync(
    file,
    generate(ast, { comments: true }).code.replace(
      "// Recovered reference application logic. See research/REVERSE_ENGINEERING.md.\n",
      "",
    ) + "\n",
  );
}
