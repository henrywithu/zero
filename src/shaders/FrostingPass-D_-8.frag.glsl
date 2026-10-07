uniform sampler2D uPrevTrail;
  uniform sampler2D uFrostTexture;
  uniform float     uHasFrostTexture;
  uniform vec2      uFrostCoverScale;
  uniform vec2      uCursorUV;
  uniform float     uCursorRadius;
  uniform float     uFade;       
  uniform float     uHeadFade;   
  uniform float     uAspect;
  uniform float     uCursorActive;
  uniform float     uCursorIntensity;
  uniform float     uSpread;
  uniform float     uSpreadStep;
  uniform vec2      uSpreadAxis;
  varying vec2 vUv;

  void main() {
    vec2 prev2 = texture2D(uPrevTrail, vUv).rg;
    float prev     = prev2.r;
    float prevHead = prev2.g;

    
    
    
    if (uSpread > 0.5) {
      vec2 fUv = (vUv - 0.5) * uFrostCoverScale + 0.5;
      float iceLuma = uHasFrostTexture > 0.5
        ? dot(texture2D(uFrostTexture, fUv).rgb, vec3(0.299, 0.587, 0.114))
        : 1.0;
      float md = 0.4 + iceLuma * 1.2;
      float s = uSpreadStep * md;
      vec2 dir = uSpreadAxis;
      dir.x *= s;
      dir.y *= s * uAspect;
      float d = 0.92;
      float m = prev;
      m = max(m, texture2D(uPrevTrail, vUv + dir).r * d);
      m = max(m, texture2D(uPrevTrail, vUv + dir * 2.0).r * d * d);
      m = max(m, texture2D(uPrevTrail, vUv - dir).r * d);
      m = max(m, texture2D(uPrevTrail, vUv - dir * 2.0).r * d * d);
      
      
      gl_FragColor = vec4(m, prevHead * uHeadFade, 0.0, 1.0);
      return;
    }

    float faded     = prev     * uFade;
    float headFaded = prevHead * uHeadFade;

    
    vec2  delta = vUv - uCursorUV;
    delta.x    *= uAspect;
    float dist  = length(delta);

    
    float discBase = 1.0 - smoothstep(0.0, uCursorRadius, dist);

    
    vec2  frostUv = (vUv - 0.5) * uFrostCoverScale + 0.5;
    float iceLuma = uHasFrostTexture > 0.5
      ? dot(texture2D(uFrostTexture, frostUv).rgb, vec3(0.299, 0.587, 0.114))
      : 1.0;
    
    
    float perceivedLuma = pow(max(iceLuma, 0.0), 1.0 / 2.2);
    float texContrast = clamp(0.0001 + (perceivedLuma - 0.5) * 5.0, 0.0, 5.0);
    float disc = discBase * texContrast;

    
    float contrib = disc * uCursorActive * uCursorIntensity;
    float trail = max(faded, contrib);

    
    
    
    
    float headContrib = discBase * uCursorActive * uCursorIntensity;
    float headTrail = max(headFaded, headContrib);

    gl_FragColor = vec4(trail, headTrail, 0.0, 1.0);
  }
