/** Rebuilds independently importable application modules from the archived source.
 * Third-party implementations are replaced with pinned package imports.
 * This is a research tool; neither original bundle nor this tool runs in Zero.
 */
import fs from "node:fs";
import path from "node:path";
import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";
import generateModule from "@babel/generator";
const traverse = traverseModule.default,
  generate = generateModule.default;
const source = fs.readFileSync("research/original/main.js", "utf8");
const ast = parse(source, { sourceType: "module" });
const aliases = {
  As: "DataTexture",
  E: "RGBAFormat",
  W: "SRGBColorSpace",
  v: "LinearFilter",
  zc: "LoadingManager",
  Vh: "DRACOLoader",
  Hm: "GLTFLoader",
  ig: "KTX2Loader",
  _t: "Texture",
  fe: "LinearSRGBColorSpace",
  f: "RepeatWrapping",
  b: "LinearMipmapLinearFilter",
  Y: "gsap",
  Xe: "MathUtils",
  K: "Vector3",
  $t: "Matrix4",
  Ct: "Quaternion",
  si: "OrthographicCamera",
  ar: "BufferGeometry",
  Zn: "Float32BufferAttribute",
  Cr: "Mesh",
  Pr: "ShaderMaterial",
  jr: "UniformsUtils",
  G: "Vector2",
  bt: "WebGLRenderTarget",
  w: "HalfFloatType",
  ul: "Clock",
  q: "Color",
  vt: "Vector4",
  k: "RedFormat",
  h: "NearestFilter",
  $o: "Scene",
  p: "ClampToEdgeWrapping",
  Gn: "MeshBasicMaterial",
  Zr: "PlaneGeometry",
  Os: "SkinnedMesh",
  Ir: "PerspectiveCamera",
  Dl: "AnimationMixer",
  te: "InterpolateDiscrete",
  Go: "Group",
  _c: "MeshMatcapMaterial",
  pc: "CylinderGeometry",
  cl: "InstancedBufferGeometry",
  Ps: "InstancedBufferAttribute",
  un: "Euler",
  sc: "VideoTexture",
  fc: "CircleGeometry",
  Jn: "BufferAttribute",
  x: "UnsignedByteType",
  ac: "Points",
  hc: "MeshStandardMaterial",
  Et: "Box3",
  il: "PointLight",
  be: "DynamicDrawUsage",
  Hs: "InstancedMesh",
  dc: "CanvasTexture",
  Kc: "TextureLoader",
  Zo: "WebGLRenderer",
  Er: "BoxGeometry",
  rs: "SpriteMaterial",
  _s: "Sprite",
  Wt: "Sphere",
  iT: "OrbitControls",
  Ml: "AxesHelper",
  mc: "RingGeometry",
  Ol: "Raycaster",
  vg: "howler",
  rw: "SplitText",
  KE: "CustomEase",
  o_: "EffectComposer",
  s_: "RenderPass",
  $g: "Pass",
  n_: "FullScreenQuad",
  r_: "ShaderPass",
  Qg: "CopyShader",
};
const names = {
  fg: "TextureUploadQueue",
  pg: "createRadialPullTexture",
  mg: "createRadialColorTexture",
  hg: "createDualRadialTexture",
  gg: "createSolidTexture",
  _g: "AssetLoader",
  X: "audioManager",
  wg: "audioTracks",
  Tg: "HoldButton",
  Eg: "Hud",
  Ng: "ZeroGesture",
  Rg: "ScrollManager",
  Wg: "CameraRig",
  Gg: "getTextureAspect",
  qg: "getCoverScale",
  Jg: "setPassTexture",
  Yg: "setPassAsset",
  Xg: "setAtlasTexture",
  Zg: "resizePassCover",
  u_: "createBackgroundPass",
  g_: "createForegroundPass",
  y_: "qualityManager",
  w_: "TextPass",
  I_: "FrostingPass",
  G_: "ShatterPass",
  Y_: "GlassShardPass",
  nv: "LensBlurPass",
  lv: "ScrollRuler",
  pv: "MobileTimeline",
  mv: "clampProgress",
  hv: "rangeProgress",
  Cv: "awardXp",
  wv: "loadBitmapTexture",
  Dv: "createStageVideo",
  Ov: "playStageVideo",
  kv: "whenVideoReady",
  Av: "disposeStageVideo",
  Nv: "atlasUv",
  Pv: "atlasAspect",
  Lv: "createRippleTextMaterial",
  Kv: "AnimatedModel",
  Jv: "HandsModel",
  Ey: "CoinRing",
  tb: "PetalParticles",
  vb: "TextSprites",
  xb: "createBurnMaterial",
  Cb: "origamiNames",
  wb: "getOrigamiModelUrl",
  Tb: "getOrigamiAoUrl",
  Eb: "getOrigamiName",
  Db: "getOrigamiIndex",
  Lb: "HandsModelTwo",
  Ub: "GlassShards",
  Wb: "stageTwo",
  sx: "gateOneToTwo",
  yx: "stageOne",
  Sx: "gateZeroToOne",
  Xx: "stageThree",
  hS: "gateThreeToFour",
  VS: "CloudField",
  XS: "companyCards",
  QS: "companyMarkers",
  aO: "StageManager",
  nO: "stageSegments",
  hO: "LoaderHand",
  vO: "LoaderTextOverlay",
  CO: "CircleHint",
  UO: "StatusController",
  DC: "installCustomCursors",
  NC: "installClickAudio",
  uO: "installGlassEffects",
  Zw: "createJoinForm",
  PT: "createWaitlistOverlay",
  $E: "createEmailGate",
  TD: "createCompanyPopup",
  DD: "populateCompanyPopup",
  VO: "warmStarOverlay",
  PO: "createStarOverlay",
  LO: "armStarOverlay",
  BO: "stopStarOverlay",
  WO: "isDebug",
  GO: "debugStage",
  JO: "readResumeState",
  YO: "saveResumeState",
  fA: "renderFrame",
  hA: "pauseRendering",
  gA: "resumeRendering",
  oA: "stageManager",
  Gk: "scrollManager",
  Kk: "cameraRig",
  pk: "hud",
  mk: "assetLoader",
  uk: "renderer",
  ik: "scene",
  lk: "camera",
  hk: "composer",
  Q: "foregroundPass",
  _k: "backgroundPass",
  Ak: "zeroGesture",
  qk: "statusController",
  tk: "canvas",
  sA: "clock",
  cA: "animationFrameId",
  $: "experienceContext",
};
const excluded = (line) =>
  line < 32773 ||
  (line >= 33669 && line < 35540) ||
  (line >= 37140 && line < 37452) ||
  (line >= 45915 && line < 46359) ||
  (line >= 47611 && line < 48267) ||
  (line >= 50385 && line < 50892);
const regions = [
  [32773, "assets/AssetLoader"],
  [35540, "audio/AudioManager"],
  [36050, "components/HoldButton"],
  [36248, "components/Hud"],
  [36629, "input/ZeroGesture"],
  [36717, "input/ScrollManager"],
  [36880, "input/CameraRig"],
  [37079, "rendering/textureUtils"],
  [37452, "rendering/BackgroundPass"],
  [37672, "rendering/ForegroundPass"],
  [38002, "rendering/QualityManager"],
  [38121, "rendering/TextPass"],
  [38220, "rendering/FrostingPass"],
  [38950, "rendering/ShatterPass"],
  [39320, "rendering/GlassShardPass"],
  [39585, "rendering/LensBlurPass"],
  [39809, "components/ScrollRuler"],
  [39996, "components/MobileTimeline"],
  [40179, "stages/shared"],
  [40317, "rendering/TextMaterial"],
  [40451, "models/AnimatedModel"],
  [40699, "models/HandsModel"],
  [40896, "models/CoinRing"],
  [41208, "models/PetalParticles"],
  [41380, "rendering/PaperMaterials"],
  [41464, "components/TextSprites"],
  [41715, "rendering/BurnMaterial"],
  [41819, "models/origami"],
  [41884, "models/HandsModelTwo"],
  [41972, "models/GlassShards"],
  [42155, "stages/StageTwo"],
  [42251, "stages/GateOneToTwo"],
  [42689, "stages/StageOne"],
  [42972, "stages/GateZeroToOne"],
  [43133, "rendering/TunnelMaterials"],
  [43657, "stages/StageThree"],
  [44437, "stages/GateThreeToFour"],
  [44955, "models/CloudField"],
  [45218, "components/MapControls"],
  [45578, "content/companies"],
  [45665, "rendering/MapMaterials"],
  [45704, "input/cursors"],
  [46360, "components/JoinFormStyles"],
  [46607, "components/FormValidation"],
  [46696, "services/waitlistState"],
  [46986, "components/JoinForm"],
  [48267, "components/OrigamiCertificate"],
  [48370, "components/OrigamiPreview"],
  [48461, "components/WaitlistOverlay"],
  [49204, "components/Sharing"],
  [49716, "components/ShareCard"],
  [49829, "components/SharePreview"],
  [50069, "components/Referral"],
  [50892, "components/EmailGate"],
  [51652, "models/MapMarkers"],
  [51795, "components/CompanyPopup"],
  [51906, "components/CompanyPopupBehavior"],
  [52126, "models/OrigamiAvatar"],
  [52310, "models/MapScene"],
  [52431, "stages/MapStages"],
  [53446, "stages/StageManager"],
  [54330, "components/GlassEffects"],
  [54373, "components/LoaderHand"],
  [54496, "components/LoaderTextOverlay"],
  [54612, "components/CircleHint"],
  [54760, "components/StarOverlay"],
  [55029, "components/StatusController"],
  [55109, "app/experience"],
];
const category = (line) =>
  regions.filter(([start]) => start <= line).at(-1)?.[1];
let program;
traverse(ast, {
  Program(p) {
    program = p;
  },
});
// Rename resolved top-level bindings; local names remain exact for now.
const renames = { ...aliases, ...names };
traverse(ast, {
  Identifier(p) {
    const name = renames[p.node.name];
    if (!name) return;
    const binding = p.scope.getBinding(p.node.name);
    if (binding?.scope !== program.scope) return;
    if (
      p.isReferencedIdentifier() ||
      p.isBindingIdentifier() ||
      (p.parent.type === "AssignmentExpression" && p.key === "left") ||
      p.parent.type === "UpdateExpression"
    ) {
      if (p.parent.type === "ObjectProperty" && p.parent.shorthand) {
        p.parent.shorthand = false;
      }
      p.node.name = name;
    }
  },
});
const nodes = [];
for (const node of ast.program.body) {
  if (node.type === "VariableDeclaration")
    for (const d of node.declarations) {
      if (
        !excluded(d.loc.start.line) &&
        !Object.keys(aliases)
          .map((k) => aliases[k])
          .includes(d.id.name) &&
        !["IT", "LT", "RT", "zT", "rw", "nw"].includes(d.id.name)
      )
        nodes.push({
          type: "VariableDeclaration",
          kind: node.kind,
          declarations: [d],
          loc: d.loc,
        });
    }
  else if (
    node.type !== "ExportNamedDeclaration" &&
    !excluded(node.loc.start.line)
  )
    nodes.push(node);
}
// Move mutable module state to the component that writes it.
const mutableOwners = new Map();
for (const binding of Object.values(program.scope.bindings)) {
  const writers = new Set(
    binding.constantViolations
      .map((p) => category(p.node.loc.start.line))
      .filter(Boolean),
  );
  if (writers.size === 1)
    mutableOwners.set(binding.identifier.name, [...writers][0]);
}
const modules = new Map();
for (const n of nodes) {
  const key =
    n.type === "VariableDeclaration"
      ? mutableOwners.get(n.declarations[0].id.name) ||
        category(n.loc.start.line)
      : category(n.loc.start.line);
  if (!key) continue;
  if (!modules.has(key)) modules.set(key, []);
  modules.get(key).push(n);
}
// Keep primitive Three addons in npm; original ones above were embedded libs.
const external = new Map(
  Object.entries(aliases).map(([old, name]) => [name, "three"]),
);
for (const name of ["GLTFLoader", "DRACOLoader", "KTX2Loader", "OrbitControls"])
  external.set(
    name,
    `three/addons/${name === "OrbitControls" ? "controls" : "loaders"}/${name}.js`,
  );
external.set("EffectComposer", "three/addons/postprocessing/EffectComposer.js");
external.set("RenderPass", "three/addons/postprocessing/RenderPass.js");
external.set("Pass", "three/addons/postprocessing/Pass.js");
external.set("FullScreenQuad", "three/addons/postprocessing/Pass.js");
external.set("ShaderPass", "three/addons/postprocessing/ShaderPass.js");
external.set("CopyShader", "three/addons/shaders/CopyShader.js");
external.set("gsap", "gsap");
external.set("howler", "howler");
external.set("SplitText", "gsap/SplitText");
external.set("CustomEase", "gsap/CustomEase");
external.set("zT", "@runtime/preload");
external.set("c", "@runtime/interop");
// GSAP registration statements for replaced third-party plugins.
modules.set(
  "runtime/plugins",
  parse(
    "import {gsap} from 'gsap'; import {SplitText} from 'gsap/SplitText'; import {CustomEase} from 'gsap/CustomEase'; gsap.registerPlugin(SplitText,CustomEase); CustomEase.create('osmoNav','M0,0 C0.625,0.05 0,1 1,1');",
    { sourceType: "module" },
  ).program.body,
);
const owner = new Map();
for (const [key, list] of modules)
  for (const n of list) {
    if (n.type === "VariableDeclaration")
      for (const d of n.declarations) owner.set(d.id.name, key);
    if (n.type === "FunctionDeclaration") owner.set(n.id.name, key);
  }
fs.mkdirSync("src/shaders", { recursive: true });
let shaderIndex = 0;
const shaderManifest = [];
const allAst = {
  type: "File",
  program: {
    type: "Program",
    sourceType: "module",
    body: nodes,
    directives: [],
  },
};
traverse(allAst, {
  TemplateLiteral(p) {
    if (p.node.expressions.length || !p.node.quasis[0].value.cooked) return;
    const code = p.node.quasis[0].value.cooked;
    if (!/void\s+main\s*\(|gl_FragColor|gl_Position/.test(code)) return;
    const line = p.node.loc?.start.line || 0,
      key = category(line);
    if (!key) return;
    const type = /gl_FragColor/.test(code) ? "frag" : "vert";
    const hint =
      p.parent.type === "VariableDeclarator"
        ? p.parent.id.name
        : p.parent.type === "ObjectProperty"
          ? p.parent.key.name || "inline"
          : "chunk";
    const name = `${key.split("/").at(-1)}-${hint}-${++shaderIndex}.${type}.glsl`;
    fs.writeFileSync("src/shaders/" + name, code.trim() + "\n");
    const binding = `shaderSource${shaderIndex}`;
    p.replaceWith({ type: "Identifier", name: binding });
    external.set(binding, `@shaders/${name}?raw`);
    shaderManifest.push({ name, binding, component: key, line, type });
  },
});
const references = (list) => {
  const a = {
    type: "File",
    program: {
      type: "Program",
      sourceType: "module",
      body: list,
      directives: [],
    },
  };
  const refs = new Set();
  traverse(a, {
    ReferencedIdentifier(p) {
      if (
        !p.scope.getBinding(p.node.name) &&
        (owner.has(p.node.name) || external.has(p.node.name))
      )
        refs.add(p.node.name);
    },
  });
  return refs;
};
// Report dependency cycles so that boundaries can be corrected explicitly.
const graph = new Map();
for (const [key, list] of modules)
  graph.set(
    key,
    new Set(
      [...references(list)]
        .map((n) => owner.get(n))
        .filter((k) => k && k !== key),
    ),
  );
let index = 0;
const indices = new Map(),
  low = new Map(),
  stack = [],
  onStack = new Set(),
  scc = [];
function visit(v) {
  indices.set(v, index);
  low.set(v, index++);
  stack.push(v);
  onStack.add(v);
  for (const w of graph.get(v)) {
    if (!indices.has(w)) {
      visit(w);
      low.set(v, Math.min(low.get(v), low.get(w)));
    } else if (onStack.has(w)) low.set(v, Math.min(low.get(v), indices.get(w)));
  }
  if (low.get(v) === indices.get(v)) {
    const group = [];
    let w;
    do {
      w = stack.pop();
      onStack.delete(w);
      group.push(w);
    } while (w !== v);
    if (group.length > 1) scc.push(group);
  }
}
for (const key of graph.keys()) if (!indices.has(key)) visit(key);
fs.writeFileSync("research/module-cycles.json", JSON.stringify(scc, null, 2));
for (const [key, list] of modules) {
  const imports = new Map();
  for (const name of references(list)) {
    const target = owner.get(name);
    if (target === key) continue;
    const from = target
      ? path.posix.relative(path.posix.dirname(key), target + ".ts")
      : external
          .get(name)
          .replace(
            "@shaders/",
            path.posix.relative(path.posix.dirname(key), "shaders") + "/",
          )
          .replace(
            "@runtime/",
            path.posix.relative(path.posix.dirname(key), "runtime") + "/",
          );
    const modulePath =
      from.startsWith(".") ||
      (!target && !from.includes("/") && from !== "three")
        ? from
        : target || from.includes("shaders/") || from.includes("runtime/")
          ? "./" + from
          : from;
    if (!imports.has(modulePath)) imports.set(modulePath, []);
    imports.get(modulePath).push(name);
  }
  let header =
    "// @ts-nocheck\n// Recovered reference application logic. See research/REVERSE_ENGINEERING.md.\n";
  for (const [from, names] of imports) {
    if (from.includes("?raw")) header += `import ${names[0]} from '${from}';\n`;
    else if (names.includes("howler"))
      header += `import * as howler from 'howler';\n`;
    else header += `import { ${names.join(", ")} } from '${from}';\n`;
  }
  const exports = [...owner].filter(([, k]) => k === key).map(([n]) => n);
  let code = generate(
    { type: "Program", sourceType: "module", body: list, directives: [] },
    { comments: true },
  ).code;
  if (key === "services/waitlistState") {
    code = code
      .replace(/var lw = [^;]+;/, 'var lw = \"local-zero\";')
      .replace(/var uw = [^;]+;/, 'var uw = \"\";')
      .replace(/fetch\(/g, "localWaitlistRequest(");
    header += "import { localWaitlistRequest } from './LocalWaitlist.ts';\n";
  }
  code = code
    .replace(/\.\/html2canvas-Crn1iB-n\.js/g, "html2canvas")
    .replace(/\.\/mp4-muxer-DctcaKuz\.js/g, "mp4-muxer")
    .replace(/\.\/stats\.min-B8Jrjy3P\.js/g, "stats.js")
    .replace(/\.\/lil-gui\.esm-riACrVWc\.js/g, "lil-gui")
    .replace(/\.\/autoScrollMode-a9ywvrmh\.js/g, "../input/AutoScroll.ts");
  fs.mkdirSync("src/" + path.posix.dirname(key), { recursive: true });
  fs.writeFileSync(
    "src/" + key + ".ts",
    header +
      code +
      (exports.length ? "\nexport { " + exports.join(", ") + " };\n" : ""),
  );
}
fs.writeFileSync(
  "research/shader-manifest.json",
  JSON.stringify(shaderManifest, null, 2),
);
fs.writeFileSync(
  "research/module-manifest.json",
  JSON.stringify(
    [...modules].map(([file, list]) => ({
      file: "src/" + file + ".ts",
      sourceLines: [
        Math.min(...list.map((n) => n.loc?.start.line || 0)),
        Math.max(...list.map((n) => n.loc?.end.line || 0)),
      ],
      dependencies: [...graph.get(file)],
    })),
    null,
    2,
  ),
);
console.log(
  "Recovered",
  modules.size,
  "modules and",
  shaderIndex,
  "shader sources. Cycles:",
  scc,
);
