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
for (const file of files("src").filter((p) => p.endsWith(".ts"))) {
  let code = fs.readFileSync(file, "utf8");
  if (!code.includes("Recovered behavior with explicit dynamic")) continue;
  code = code.replace(/([}\]])\?: any/g, "$1: any");
  const ast = parse(code, { sourceType: "module", plugins: ["typescript"] });
  traverse(ast, {
    Function(p) {
      if (p.node.async)
        p.node.returnType = {
          type: "TSTypeAnnotation",
          typeAnnotation: {
            type: "TSTypeReference",
            typeName: { type: "Identifier", name: "Promise" },
            typeParameters: {
              type: "TSTypeParameterInstantiation",
              params: [{ type: "TSAnyKeyword" }],
            },
          },
        };
      for (const param of p.node.params)
        if (
          ["ObjectPattern", "ArrayPattern"].includes(param.type) ||
          p.node.kind === "set"
        )
          param.optional = false;
      const lastRequired = p.node.params.findLastIndex((n) =>
        ["ObjectPattern", "ArrayPattern"].includes(n.type),
      );
      for (let i = 0; i < lastRequired; i++) p.node.params[i].optional = false;
    },
    "ForOfStatement|ForInStatement"(p) {
      if (p.node.left.type === "VariableDeclaration")
        for (const d of p.node.left.declarations) d.id.typeAnnotation = null;
    },
    CallExpression(p) {
      if (
        p.node.callee.type === "MemberExpression" &&
        p.node.callee.object.name === "Object" &&
        ["entries", "values"].includes(p.node.callee.property.name) &&
        p.parent.type !== "TSAsExpression"
      )
        p.replaceWith({
          type: "TSAsExpression",
          expression: p.node,
          typeAnnotation: {
            type: "TSArrayType",
            elementType: { type: "TSAnyKeyword" },
          },
        });
    },
    MemberExpression(p) {
      if (p.node.object.type === "ObjectExpression")
        p.node.object = {
          type: "TSAsExpression",
          expression: p.node.object,
          typeAnnotation: { type: "TSAnyKeyword" },
        };
    },
  });
  if (file === "src/audio/AudioManager.ts") {
    code = generate(ast).code.replace(
      "import * as howler from 'howler';",
      "import * as howlerPackage from 'howler';\nconst howler: any = howlerPackage;",
    );
  } else code = generate(ast).code;
  if (file === "src/input/CameraRig.ts")
    code = code.replaceAll(
      "DeviceOrientationEvent.requestPermission",
      "(DeviceOrientationEvent as any).requestPermission",
    );
  fs.writeFileSync(file, code + "\n");
}
