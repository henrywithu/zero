precision mediump float;

  uniform sampler2D uAtlas;
  uniform float uOpacity;

  varying vec2 vUv;
  varying vec4 vPetalRect;
  varying float vOpacity;
  varying float vBrightness;
  varying float vSaturation;
  varying float vFresnel;

  void main() {
    // Per-petal atlas sub-rect (vPetalRect = offset.xy, scale.zw). A 1% inset
    // keeps ETC1S block edges from bleeding across neighbouring petals.
    vec2 atlasUV = vPetalRect.xy + vPetalRect.zw * (0.01 + vUv * 0.98);

    vec4 texel = texture2D(uAtlas, atlasUV);

    // Combined discard: texture alpha AND envelope opacity. Edge-fade
    // petals + per-instance opacity can have ~20% of fragments effectively
    // invisible — skip all the colour-grading math (luma dot, mix, fresnel
    // chroma reconstruction) for them.
    float outA = texel.a * uOpacity * vOpacity;
    if (outA < 0.005) discard;

    float lum = dot(texel.rgb, vec3(0.299, 0.587, 0.114));
    vec3 color = mix(vec3(lum), texel.rgb, vSaturation) * vBrightness;
    float fresnelFactor = 0.65 + 1.15 * vFresnel;
    float baseLum = lum * vBrightness;
    float newLum = baseLum * fresnelFactor;
    vec3 chroma = color - baseLum;
    color = newLum + chroma * (newLum / max(baseLum, 0.001));
    gl_FragColor = vec4(color, outA);
  }
