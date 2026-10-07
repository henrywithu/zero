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
var companyCards: any = [
  {
    name: `Nike`,
    logo: `nike`,
    video: `Nike-Card.mp4`,
    role: `Data Scientist`,
    scenario: `Demand Forecasting Model for Nike Zoom Launch`,
    description: `Build a demand forecasting model that predicts weekly sales for the Nike Zoom launch.`,
    tools: [`cursor`, `pandas`, `jupyter`, `notebook`, `python`],
  },
  {
    name: `OpenAI (ChatGPT)`,
    logo: `openai`,
    video: `ChatGPT-Card.mp4`,
    role: `Business Analyst`,
    scenario: `ChatGPT Conversion Analysis`,
    description: `Identify why ChatGPT users aren't upgrading and propose a solution to improve conversion.`,
    tools: [`codex`, `canva`, `googlesheets`],
  },
  {
    name: `Google`,
    logo: `google`,
    video: `Google-Card.mp4`,
    role: `Software Engineer`,
    scenario: `Gmail AI Rewrite Prototype`,
    description: `Build an AI rewrite prototype in Gmail that helps users finish long email drafts.`,
    tools: [`cursor`, `nextjs`, `vercel`, `supabase`, `gemini`],
  },
  {
    name: `Spotify`,
    logo: `spotify`,
    video: `Spotify-Card.mp4`,
    role: `Business Analyst`,
    scenario: `Restoring Free-to-Premium Conversion at Spotify`,
    description: ``,
    tools: [`anthropic`, `googlesheets`, `googleslides`],
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
    role: e.role,
    scenario: e.scenario,
    description: e.description,
    tools: e.tools,
  };
});
var $S: any = shaderSource45;
var eC: any = shaderSource46;
export { YS, companyCards, ZS, companyMarkers, $S, eC };
