// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import shaderSource45 from "../shaders/companies-$S-45.vert.glsl?raw";
import shaderSource46 from "../shaders/companies-eC-46.frag.glsl?raw";
var YS: any = {
  python: `Python`,
  jupyter: `Jupyter`,
  notebook: `Notebook`,
  pandas: `Pandas`,
  cursor: `Cursor`,
  codex: `Codex`,
  canva: `Canva`,
  googlesheets: `Google Sheets`,
  googleslides: `Google Slides`,
  nextjs: `Next.js`,
  vercel: `Vercel`,
  supabase: `Supabase`,
  gemini: `Gemini`,
  anthropic: `Claude`,
};
// Curated from Henry's Trapnest journal; marker positions and scene behavior stay intact.
var companyCards: any = [
  {
    name: `Trapnest Theory`,
    logo: `trapnest`,
    image: `theory.webp`,
    imageAlt: `Trapnest Theory's unified spatial world`,
    role: `Art × Technology`,
    scenario: `The Unified Field`,
    description: `Fourteen experimental worlds, woven into a single spatial continuum. A journal of light, particles, and possibility.`,
    tools: [],
    href: `https://henrywithu.com/trapnest-theory-the-unified-field/`,
  },
  {
    name: `Trapnest Vines`,
    logo: `trapnest`,
    image: `vines.webp`,
    imageAlt: `Trapnest Vines — an exploration of terroir`,
    role: `Life × Science`,
    scenario: `The Calculus of Terroir`,
    description: `A landscape shaped by time. Explore the curl noise, fluid dynamics, and quiet mathematics behind a living terroir.`,
    tools: [],
    href: `https://henrywithu.com/trapnest-vines-the-calculus-of-terroir/`,
  },
  {
    name: `Trapnest Design`,
    logo: `trapnest`,
    image: `design.webp`,
    imageAlt: `Trapnest Design — from pencil sketches to interactive space`,
    role: `Art × Science`,
    scenario: `From Sketch to Space`,
    description: `An idea begins on paper and becomes a world. Follow pencil marks into tactile shaders, color, and aerodynamic motion.`,
    tools: [],
    href: `https://henrywithu.com/trapnest-design-from-sketch-to-space/`,
  },
  {
    name: `Trapnest Kaizen`,
    logo: `trapnest`,
    image: `kaizen.webp`,
    imageAlt: `Trapnest Kaizen's hand-painted origami world`,
    role: `Life × Art`,
    scenario: `Hold, Release, Repeat`,
    description: `Small gestures, endless beginnings. Wind up a hand-painted world and discover the physics that sends origami into flight.`,
    tools: [],
    href: `https://henrywithu.com/trapnest-kaizen-hold-release-repeat/`,
  },
];
var ZS: any = [
  {
    x: 0.317,
    y: 0.042,
  },
  {
    x: -0.089,
    y: -0.154,
  },
  {
    x: -0.115,
    y: 0.186,
  },
  {
    x: 0.134,
    y: -0.08,
  },
];
var companyMarkers: any = companyCards.map((e?: any, t?: any): any => {
  let n: any = ZS[t] || {
    x: 0,
    y: 0,
  };
  return {
    id: `m${t}`,
    x: n.x,
    y: n.y,
    company: e.name,
    logo: e.logo,
    video: e.video,
    image: e.image,
    imageAlt: e.imageAlt,
    href: e.href,
    role: e.role,
    scenario: e.scenario,
    description: e.description,
    tools: e.tools,
  };
});
var $S: any = shaderSource45;
var eC: any = shaderSource46;
export { YS, companyCards, ZS, companyMarkers, $S, eC };
