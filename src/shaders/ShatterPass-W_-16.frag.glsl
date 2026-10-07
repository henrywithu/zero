precision mediump float;
  uniform sampler2D tDiffuse;
  uniform sampler2D uShatter;
  uniform sampler2D uHandMask;
  varying vec2 vUv;

  vec3 linearToSRGB(vec3 c) {
    c = clamp(c, 0.0, 1.0);
    return mix(
      1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055,
      c * 12.92,
      vec3(lessThan(c, vec3(0.0031308)))
    );
  }

  void main() {
    vec4 live    = texture2D(tDiffuse, vUv);
    vec4 shatter = texture2D(uShatter, vUv);
    float handMask = texture2D(uHandMask, vUv).r;

    
    float mask = shatter.a * (1.0 - handMask);

    
    
    gl_FragColor = vec4(mix(live.rgb, linearToSRGB(shatter.rgb), mask), 1.0);
  }
