/** Adds explicit dynamic boundaries to recovered JavaScript while retaining runtime semantics. */
import fs from "node:fs";
import path from "node:path";
import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";
import generateModule from "@babel/generator";
const traverse = traverseModule.default,
  generate = generateModule.default;
const any = () => ({
  type: "TSTypeAnnotation",
  typeAnnotation: { type: "TSAnyKeyword" },
});
const typedParam = (p) => {
  if (p.type === "AssignmentPattern") {
    p.left.typeAnnotation ??= any();
  } else if (p.type === "RestElement") {
    p.typeAnnotation ??= {
      type: "TSTypeAnnotation",
      typeAnnotation: {
        type: "TSArrayType",
        elementType: { type: "TSAnyKeyword" },
      },
    };
  } else {
    p.typeAnnotation ??= any();
    p.optional = true;
  }
};
function files(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory()
        ? files(path.join(dir, e.name))
        : [path.join(dir, e.name)],
    );
}
for (const file of files("src").filter((p) => p.endsWith(".ts"))) {
  let code = fs.readFileSync(file, "utf8");
  if (!code.startsWith("// @ts-nocheck")) continue;
  const ast = parse(code.replace("// @ts-nocheck\n", ""), {
    sourceType: "module",
    plugins: ["typescript"],
  });
  traverse(ast, {
    VariableDeclarator(p) {
      if (
        p.node.id.type === "Identifier" &&
        !["ClassExpression"].includes(p.node.init?.type)
      )
        p.node.id.typeAnnotation ??= any();
    },
    Function(p) {
      for (const param of p.node.params) typedParam(param);
      if (p.node.kind !== "constructor" && p.node.kind !== "set")
        p.node.returnType ??= any();
      if (
        p.node.type === "FunctionExpression" ||
        p.node.type === "FunctionDeclaration" ||
        p.node.type === "ObjectMethod"
      ) {
        p.node.params.unshift({
          type: "Identifier",
          name: "this",
          typeAnnotation: any(),
        });
      }
    },
    CatchClause(p) {
      if (p.node.param) p.node.param.typeAnnotation ??= any();
    },
    Class(p) {
      const properties = new Set();
      const methods = new Set(p.node.body.body.map((n) => n.key?.name));
      p.traverse({
        Class(q) {
          if (q !== p) q.skip();
        },
        MemberExpression(q) {
          if (
            q.node.object.type === "ThisExpression" &&
            !q.node.computed &&
            q.node.property.type === "Identifier" &&
            !methods.has(q.node.property.name)
          )
            properties.add(q.node.property.name);
        },
      });
      for (const name of properties)
        p.node.body.body.unshift({
          type: "ClassProperty",
          key: { type: "Identifier", name },
          typeAnnotation: any(),
          value: null,
          declare: true,
          computed: false,
          static: false,
        });
    },
  });
  fs.writeFileSync(
    file,
    "// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.\n" +
      generate(ast, { comments: true }).code +
      "\n",
  );
}
