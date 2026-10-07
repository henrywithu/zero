precision mediump float;
  uniform vec3 uColor;
  uniform float uBaseAlpha;   // green opacity at the base
  uniform float uCapR;        // ellipse vertical radius in vUv (both caps)
  uniform float uHeight;      // 0..1 — how far the column has RISEN from its base
  uniform float uTime;        // drives the upward-travelling intensity wave
  varying vec2 vUv;
  void main() {
    float u = vUv.x * 2.0 - 1.0;                 // -1..1 across the width
    float arc = sqrt(max(0.0, 1.0 - u * u));     // ellipse arc factor at this x
    float botC = uCapR;                          // bottom (base) ellipse centre — CONSTANT
    float topFull = 1.0 - uCapR;                 // top-ellipse centre at full height
    // The top ellipse RISES from the base up to topFull as uHeight goes 0→1,
    // while the base ellipse stays put — so the column grows upward in the iso
    // view. (Scaling the mesh on Y instead would squash the elliptical caps and
    // read as a flat vertical stretch, not an iso column.)
    float topC = mix(botC, topFull, clamp(uHeight, 0.0, 1.0));
    // Elliptical top AND bottom silhouette so the column reads as a 3D iso
    // cylinder (curved openings) and the base curves in instead of cutting flat.
    if (vUv.y > topC + uCapR * arc) discard;     // above the current top ellipse arc
    if (vUv.y < botC - uCapR * arc) discard;     // below the base ellipse lower arc
    // Green gradient up the body: full at the base ellipse -> 0 at the top.
    float span = max(topC - botC, 1e-4);
    float vGrad = clamp((topC - vUv.y) / span, 0.0, 1.0);
    // Cylindrical shading — bright middle, dimmer-but-defined L/R edges.
    float shade = 0.45 + 0.55 * arc;
    // step() keeps it fully invisible at height 0 (no base-cap sliver).
    float a = vGrad * shade * uBaseAlpha * step(0.0001, uHeight);
    // Travelling wave: a band of higher intensity sweeps UP the column and
    // loops. h = normalized height above the base (0 base → 1 top); the
    // band distance wraps (min(d, 1-d)) so the loop restart is seamless.
    // Iso correction: a ring around the column shows its NEAR (lower) arc
    // on the front wall — the same ellipse math as the caps. Sampling the
    // wave at the ring-CENTRE height (y + capR·arc) makes the band curve
    // like an elliptical cross-section instead of a flat horizontal line.
    float h = clamp(((vUv.y + uCapR * arc) - botC) / span, 0.0, 1.0);
    float wd = abs(h - fract(uTime * 0.22));
    wd = min(wd, 1.0 - wd);
    float wave = 1.0 - smoothstep(0.0, 0.16, wd);
    a *= 1.0 + wave * 1.1;
    // Premultiplied for the color-dodge-style blend (result = dst * (1 + src)).
    gl_FragColor = vec4(uColor * a, a);
  }
