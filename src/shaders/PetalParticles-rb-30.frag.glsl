precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float uMaxBlur;
  uniform float uProgress; 
  uniform vec2 uAtlasOffset;
  uniform vec2 uAtlasScale;
  uniform float uNoiseSeed;
  uniform float uAspect;
  
  
  uniform float uRotate;

  
  
  
  
  float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.zyx + 31.32);
    return fract((p3.x + p3.y) * p3.z);
  }

  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  
  
  
  
  vec3 flareBoost(vec3 rgb, float flare) {
    float luma = dot(rgb, vec3(0.299, 0.587, 0.114));
    return mix(vec3(luma), rgb, 1.0 + 3.0 * flare) * (1.0 + 0.25 * flare);
  }

  void main() {
    
    vec2 suv = (uRotate > 0.5) ? vec2(vUv.y, 1.0 - vUv.x) : vUv;

    
    
    
    
    if (uProgress >= 0.999) {
      gl_FragColor = texture2D(uTexture, uAtlasOffset + suv * uAtlasScale);
      return;
    }

    float effectiveProgress = uProgress * 1.3;

    
    float n = vnoise(vec2(suv.x * uAspect, suv.y) * 4.0 + uNoiseSeed);
    float mask = suv.x * 0.5 + n * 0.5;
    
    
    
    
    float flare = smoothstep(effectiveProgress - 0.85, effectiveProgress + 0.1, mask);
    flare *= 1.0 - smoothstep(0.8, 1.0, uProgress);
    float alpha = smoothstep(effectiveProgress + 0.3, effectiveProgress - 0.1, mask);

    
    
    if (alpha < 0.005) discard;

    vec2 aUv = uAtlasOffset + suv * uAtlasScale;

  #ifdef LITE_TEXT
    
    
    
    
    
    vec4 c0 = texture2D(uTexture, aUv);
    gl_FragColor = vec4(flareBoost(c0.rgb, flare), c0.a * alpha);
  #else
    
    float blurFactor = smoothstep(effectiveProgress - 0.5, effectiveProgress + 0.3, mask);

    
    
    
    
    
    if (blurFactor < 0.03) {
      vec4 c0 = texture2D(uTexture, aUv);
      gl_FragColor = vec4(flareBoost(c0.rgb, flare), c0.a * alpha);
      return;
    }

    
    
    float r = blurFactor * uMaxBlur * 0.003;

    
    vec4 color = texture2D(uTexture, aUv) * 2.0;
    float total = 2.0;

    
    vec2 uv1 = clamp(suv + vec2(r,          0.0),        0.0, 1.0);
    vec2 uv2 = clamp(suv + vec2(r * 0.5,    r * 0.866),  0.0, 1.0);
    vec2 uv3 = clamp(suv + vec2(-r * 0.5,   r * 0.866),  0.0, 1.0);
    vec2 uv4 = clamp(suv + vec2(-r,          0.0),        0.0, 1.0);
    vec2 uv5 = clamp(suv + vec2(-r * 0.5,  -r * 0.866),  0.0, 1.0);
    vec2 uv6 = clamp(suv + vec2(r * 0.5,   -r * 0.866),  0.0, 1.0);

    color += texture2D(uTexture, uAtlasOffset + uv1 * uAtlasScale);
    color += texture2D(uTexture, uAtlasOffset + uv2 * uAtlasScale);
    color += texture2D(uTexture, uAtlasOffset + uv3 * uAtlasScale);
    color += texture2D(uTexture, uAtlasOffset + uv4 * uAtlasScale);
    color += texture2D(uTexture, uAtlasOffset + uv5 * uAtlasScale);
    color += texture2D(uTexture, uAtlasOffset + uv6 * uAtlasScale);
    total += 6.0;

    color /= total;

    gl_FragColor = vec4(flareBoost(color.rgb, flare), color.a * alpha);
  #endif
  }
