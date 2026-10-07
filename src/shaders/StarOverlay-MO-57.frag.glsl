uniform sampler2D uColour;   // star clip — RGB (bright star on a dark field)
  uniform float uFade;         // global fade-out at the tail
  uniform float uAspect;       // plane width / height (for a true circle)
  uniform float uFeather;      // soft edge width (shorter-half units) for blend
  uniform float uVideoZoom;    // >1 shrinks the clip inside the (unchanged) mask
  varying vec2 vUv;
  void main() {
    // Zoom OUT about the centre: sample a wider UV range so the clip renders
    // smaller inside the mask. Out-of-range UVs clamp to the clip's edge,
    // which is black field → alpha 0 via the luma matte, so no visible seam.
    vec2 zUv = (vUv - 0.5) * uVideoZoom + 0.5;
    vec3 rgb = texture2D(uColour, zUv).rgb;
    // Luminance self-matte: the clip has no alpha (it's an mp4), so transparency
    // comes from brightness. max-channel keeps saturated/coloured parts of the
    // star fully solid while the black field drops to zero alpha.
    float a = max(rgb.r, max(rgb.g, rgb.b));

    // Circular crop — clip the rectangular plane to its inscribed circle, the
    // WebGL equivalent of overflow:hidden on a round parent. Aspect-correct so
    // it's a circle (not an ellipse), with a feathered edge so the star melts
    // into the scene instead of ending on a hard rim.
    vec2 p = vUv - 0.5;
    p.x *= uAspect;                    // both axes now in plane-height units
    float r = 0.5 * min(uAspect, 1.0); // inscribed-circle radius (shorter half)
    float d = length(p);
    float mask = 1.0 - smoothstep(r - uFeather, r, d);

    gl_FragColor = vec4(rgb, a * uFade * mask);
  }
