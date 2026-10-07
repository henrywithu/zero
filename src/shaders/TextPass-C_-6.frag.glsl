precision mediump float;

  uniform sampler2D tDiffuse;
  uniform sampler2D uTextTexture;
  uniform float uBrightness;
  uniform float uSaturation;
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
    vec4 bg   = texture2D(tDiffuse, vUv);
    vec4 text = texture2D(uTextTexture, vUv);

    
    
    vec3 textColor = text.a > 0.001 ? text.rgb / text.a : vec3(0.0);

    
    vec3 adjusted = textColor + uBrightness;

    
    float luma = dot(adjusted, vec3(0.2126, 0.7152, 0.0722));
    adjusted = mix(vec3(luma), adjusted, uSaturation);

    
    
    adjusted = linearToSRGB(adjusted);

    
    vec3 finalRGB = bg.rgb * (1.0 - text.a) + adjusted * text.a;
    gl_FragColor = vec4(finalRGB, bg.a);
  }
