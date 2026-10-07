/// <reference types="vite/client" />
interface Window {
  gui?: import("lil-gui").default;
  __zeroWaitlistAttr?: boolean;
  gsap?: typeof import("gsap").gsap;
}
interface Window {
  __zero?: ReturnType<typeof import("./app/experience").createExperience>;
}
