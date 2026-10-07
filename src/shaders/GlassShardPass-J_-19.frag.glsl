precision mediump float;

  uniform sampler2D tDiffuse;
  uniform sampler2D uNormalMask;
  uniform sampler2D uRefractionMap;

  uniform float uRefraction;
  uniform float uDispersion;
  uniform float uMapStrength;
  uniform vec2  uMapScale;
  uniform vec3  uTintColor;
  uniform float uFresnelPower;
  uniform vec2  uPixelSize;
  uniform float uEdgeHighlight;

  varying vec2 vUv;

  void main() {
    vec4 m = texture2D(uNormalMask, vUv);

    
    vec4 live = texture2D(tDiffuse, vUv);
    if (m.r + m.g < 0.01) {
      gl_FragColor = live;
      return;
    }

    
    vec2 nxy = m.rg * 2.0 - 1.0;
    float nz  = sqrt(max(0.0, 1.0 - dot(nxy, nxy)));

    
    float rm = texture2D(uRefractionMap, m.ba * uMapScale).r;

    
    vec2 offset = nxy * uRefraction + (rm - 0.5) * uMapStrength * nxy;

    
    vec3 glass;
    if (uDispersion < 0.001) {
      glass = texture2D(tDiffuse, vUv + offset).rgb;
    } else {
      glass = vec3(
        texture2D(tDiffuse, vUv + offset * (1.0 - uDispersion)).r,
        texture2D(tDiffuse, vUv + offset).g,
        texture2D(tDiffuse, vUv + offset * (1.0 + uDispersion)).b
      );
    }

    
    glass *= uTintColor;

    
    float fresnel = 0.04 + 0.96 * pow(1.0 - nz, uFresnelPower);
    glass += vec3(0.92, 0.95, 1.0) * fresnel;

    
    if (uEdgeHighlight > 0.001) {
      vec2 nL = texture2D(uNormalMask, vUv + vec2(-uPixelSize.x, 0.0)).rg;
      vec2 nR = texture2D(uNormalMask, vUv + vec2( uPixelSize.x, 0.0)).rg;
      vec2 nT = texture2D(uNormalMask, vUv + vec2(0.0,  uPixelSize.y)).rg;
      vec2 nB = texture2D(uNormalMask, vUv + vec2(0.0, -uPixelSize.y)).rg;
      float dN = length(nR - nL) + length(nT - nB);
      glass += vec3(1.0) * smoothstep(0.02, 0.15, dN) * uEdgeHighlight;
    }

    
    gl_FragColor = vec4(mix(live.rgb, glass, 1.0), live.a);
  }
