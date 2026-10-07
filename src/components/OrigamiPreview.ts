// Recovered behavior with explicit dynamic boundaries; see research/REVERSE_ENGINEERING.md.
import { gsap } from "gsap";
var vT: any = [
  `20,82 20,18 70,18 120,18 120,50 120,82 70,82 45,82`,
  `20,82 20,42 46,18 120,18 120,50 120,82 70,82 45,82`,
  `20,82 20,42 46,18 94,18 120,42 120,82 70,82 45,82`,
  `26,84 40,56 70,18 100,56 114,84 92,84 70,84 48,84`,
  `38,50 54,26 70,14 86,26 102,50 86,72 70,84 54,72`,
  `36,50 54,26 70,14 86,26 104,50 92,74 70,64 48,74`,
  `18,30 44,30 70,8 86,26 124,28 100,56 70,78 38,52`,
];
function yT(this: any, e?: any): any {
  let t: any = document.createElement(`div`);
  t.setAttribute(`aria-hidden`, `true`);
  t.style.cssText = `
    position: absolute;
    left: 50%; top: 45%;
    transform: translate(-50%, -50%);
    width: clamp(720px, 112vw, 1404px);
    pointer-events: none;
    opacity: 0;
    z-index: 3;
  `;
  t.innerHTML = `
    <svg viewBox="0 0 140 100" width="100%" style="
      display: block; overflow: visible;
      filter:
        drop-shadow(0 0 8px rgba(255, 244, 205, 0.95))
        drop-shadow(0 0 22px rgba(255, 236, 170, 0.55));
    ">
      <polygon points="${vT[0]}" fill="#ffffff"></polygon>
    </svg>
  `;
  let n: any = t.querySelector(`polygon`);
  e.appendChild(t);
  let r: any = null,
    i: any = !1;
  return {
    play(this: any): any {
      if (i) return;
      r && r.kill();
      gsap.set(n, {
        attr: {
          points: vT[0],
        },
      });
      r = gsap.timeline();
      r.fromTo(
        t,
        {
          opacity: 0,
          scale: 0.7,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.65,
          ease: `power2.out`,
        },
        0,
      );
      let e: any = 0.7;
      for (let t: any = 1; t < vT.length; t++) {
        r.to(
          n,
          {
            attr: {
              points: vT[t],
            },
            duration: 0.75,
            ease: `sine.inOut`,
          },
          e,
        );
        e += 0.78;
      }
      r.to(
        t,
        {
          y: -8,
          duration: 0.8,
          ease: `sine.inOut`,
          yoyo: !0,
          repeat: 1,
        },
        e,
      );
      r.to(t, {
        opacity: 0,
        scale: 1.18,
        duration: 0.7,
        ease: `power2.inOut`,
        onComplete: (): any => {
          i = !0;
        },
      });
      return r;
    },
    hide(this: any, e: any = 0.5): any {
      i ||
        ((i = !0),
        gsap.to(t, {
          opacity: 0,
          scale: 1.18,
          duration: e,
          ease: `power2.inOut`,
          onComplete: (): any => {
            r && r.kill();
          },
        }));
    },
    destroy(this: any): any {
      r && r.kill();
      gsap.killTweensOf(t);
      t.remove();
    },
  };
}
export { vT, yT };
