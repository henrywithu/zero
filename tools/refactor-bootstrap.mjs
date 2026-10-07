import fs from "node:fs";
import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";
import generateModule from "@babel/generator";
const traverse = traverseModule.default,
  generate = generateModule.default,
  file = "src/app/experience.ts";
let ast = parse(fs.readFileSync(file, "utf8"), {
  sourceType: "module",
  plugins: ["typescript"],
});
let program;
traverse(ast, {
  Program(p) {
    program = p;
  },
});
const renames = {
  Sk: "frostingPass",
  Ck: "loaderHand",
  wk: "loaderText",
  Tk: "circleHint",
  Ek: "starOverlay",
  Dk: "lensBlurPass",
  vk: "glassShardPass",
  yk: "textPass",
  bk: "shatterPass",
  xk: "removeMouseInteraction",
  nk: "viewportWidth",
  rk: "viewportHeight",
  gk: "scenePass",
  kk: "whiteTexture",
  jk: "pointer",
  Mk: "pointerPressed",
  Nk: "drawingEnabled",
  Pk: "pointerDirty",
  Fk: "pointerX",
  Ik: "pointerY",
  Lk: "interactionDirty",
  Rk: "multiTouchActive",
  zk: "lastPointerX",
  Bk: "lastPointerY",
  Vk: "lastPointerTime",
  Hk: "pointerSpeed",
  Uk: "soundSpeedScale",
  Wk: "pointerSpeedDecay",
  KO: "resumeStorageKey",
  qO: "resumeExpiryMs",
  Jk: "onPointerMove",
  Yk: "onPointerDown",
  Xk: "onPointerUp",
  Zk: "onScenePointerMove",
  Qk: "unlockAudio",
  $k: "updateTouchCount",
  eA: "isDesktop",
  tA: "hoverGlowStrength",
  nA: "hoverSuppressionRadius",
  rA: "hoverDisabled",
  iA: "showHoverFrost",
  aA: "hideHoverFrost",
  dk: "resizeCoverScales",
  Ok: "setPixelRatio",
  ck: "cameraFov",
  ak: "desktopFov",
  ok: "mobileFov",
  sk: "mobileBreakpoint",
  fk: "wasMobile",
  XO: "stats",
  ZO: "gpuStats",
  QO: "memoryStats",
  ek: "gpuTimer",
  $O: "gpuSampleInterval",
  lA: "noiseInterval",
  uA: "noiseElapsed",
  dA: "noiseSpeed",
  pA: "renderingPaused",
  mA: "contextLost",
  _A: "debugGui",
  vA: "debugOrbit",
};
for (const [old, name] of Object.entries(renames))
  if (program.scope.hasOwnBinding(old)) program.scope.rename(old, name);
const body = ast.program.body.filter(
  (n) => n.type !== "ImportDeclaration" && n.type !== "ExportNamedDeclaration",
);
for (let i = 0; i < body.length; i++)
  if (
    body[i].type === "ExpressionStatement" &&
    generate(body[i]).code.startsWith("Promise.all(")
  )
    body[i] = {
      type: "VariableDeclaration",
      kind: "const",
      declarations: [
        {
          type: "VariableDeclarator",
          id: { type: "Identifier", name: "ready" },
          init: body[i].expression,
        },
      ],
    };
body.push(
  ...parse(
    `return {renderer, composer, assetLoader, hud, zeroGesture, stageManager, scrollManager, cameraRig, context: experienceContext, ready, pauseRendering, resumeRendering, get frame(){return animationFrameId}, get loaderText(){return loaderText}, get circleHint(){return circleHint}, get textPass(){return textPass}, get starOverlay(){return starOverlay}, get frostingPass(){return frostingPass}, get foregroundPass(){return foregroundPass}};`,
    { allowReturnOutsideFunction: true },
  ).program.body,
);
const imports = ast.program.body.filter((n) => n.type === "ImportDeclaration");
ast.program.body = [
  ...imports,
  {
    type: "ExportNamedDeclaration",
    specifiers: [],
    source: null,
    declaration: {
      type: "FunctionDeclaration",
      id: { type: "Identifier", name: "createExperience" },
      params: [],
      body: { type: "BlockStatement", body, directives: [] },
      generator: false,
      async: false,
    },
  },
];
fs.writeFileSync(file, generate(ast, { comments: true }).code + "\n");
