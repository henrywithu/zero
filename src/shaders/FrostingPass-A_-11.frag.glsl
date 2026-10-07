uniform sampler2D tDiffuse;
  uniform sampler2D uTrailTexture;
  uniform sampler2D uFrostTexture;     
  uniform sampler2D uIceNormalTxt;     
  uniform float     uOpacity;
  uniform float     uWhiteout;
  uniform float     uTrailWhite;
  uniform float     uMelt;            
  uniform float     uCenterWhite;     
  uniform float     uLightIntensity;
  uniform vec2      uFrostCoverScale;
  uniform float     uHasFrostTexture;
  uniform float     uHasIceNormal;
  uniform float     uLoadProgress;
  uniform float     uDisplacement;     
  uniform float     uAspect;           
  uniform vec2      uNormalBias;       
  uniform vec2      uFrostShift;       
  varying vec2 vUv;

  
  float rand(vec2 n) {
    vec3 p = fract(vec3(n.xyx) * vec3(443.897, 441.423, 437.195));
    p += dot(p, p.yzx + 19.19);
    return fract((p.x + p.y) * p.z);
  }

  void main() {
    
    
    
    vec2 trailData = texture2D(uTrailTexture, vUv + uFrostShift).rg;
    float cleared  = trailData.r; 
    float headRaw  = trailData.g; 

    
    
    
    vec2 ratioUv = (vUv - 0.5) * uFrostCoverScale + 0.5 + uFrostShift;

    
    
    vec4 frostTex = uHasFrostTexture > 0.5
      ? texture2D(uFrostTexture, ratioUv)
      : vec4(1.0);
    float iceDensity = frostTex.r;
    float iceLuma    = iceDensity;
    float noise      = rand(vUv * 20.0);

    
    
    
    
    float freezeVal  = (1.0 - vUv.y) * 0.6 + iceLuma * 0.4;
    float prog       = uLoadProgress * 1.5;
    float freezeMask = 1.0 - smoothstep(prog - 0.35, prog, freezeVal);

    
    
    
    
    
    
    
    
    
    
    
    
    vec2 meltDelta = vUv - 0.5;
    meltDelta.x *= uAspect;
    float meltDist = length(meltDelta);
    float meltEdge = uMelt - 0.2 + (iceLuma - 0.5) * 0.2;
    float meltMask = smoothstep(meltEdge - 0.05, meltEdge + 0.05, meltDist);

    
    
    float clearMask = clamp(1.0 - cleared, 0.0, 1.0);

    
    
    
    
    
    vec2 iceNorm = uHasIceNormal > 0.5
      ? texture2D(uIceNormalTxt, ratioUv).rg * 2.0 - 1.0 - uNormalBias
      : vec2(0.0);

    
    
    
    vec2 disp = iceNorm * uDisplacement * iceDensity * clearMask * freezeMask * meltMask;
    vec4 scene = texture2D(tDiffuse, vUv + disp);

    
    
    
    
    
    
    
    
    float centerWhite = 1.0 - smoothstep(uCenterWhite - 0.7, uCenterWhite, meltDist);
    scene.rgb = mix(scene.rgb, vec3(1.0), centerWhite);

    
    
    
    vec3 frostBase  = frostTex.rgb * uLightIntensity;
    vec3 frostColor = mix(scene.rgb, frostBase, 0.3);

    
    float frostAlpha = uOpacity * (1.0 - cleared);

    
    
    float edgeZone  = smoothstep(0.5, 0.7, cleared) * (1.0 - smoothstep(0.7, 0.95, cleared));
    float roughEdge = clamp(0.5 + (iceLuma - 0.5) * 2.5, 0.0, 1.0);
    frostAlpha = mix(frostAlpha, frostAlpha * roughEdge, edgeZone);
    frostAlpha *= (0.8 + 0.2 * noise);
    frostAlpha  = clamp(frostAlpha, 0.0, 1.0);

    
    float freezeEdge = smoothstep(0.0, 0.5, freezeMask) * (1.0 - smoothstep(0.5, 1.0, freezeMask));
    
    freezeEdge += (noise - 0.5) * 0.06;
    freezeEdge = clamp(freezeEdge, 0.0, 1.0);
    frostColor = mix(frostColor, vec3(0.773, 1.0, 0.796), freezeEdge);

    frostAlpha *= freezeMask;
    frostAlpha = max(frostAlpha, freezeEdge);

    
    
    
    
    float cappedCleared = min(cleared, 2.0);
    float trailGlow = smoothstep(0.05, 0.5, cappedCleared)
                    * (1.0 - smoothstep(0.5, 1.2, cappedCleared));

    
    
    
    
    
    float trailHead = smoothstep(0.15, 0.5, headRaw);

    float combinedGlow = max(trailGlow, trailHead);
    frostColor = mix(frostColor, vec3(1.0), combinedGlow);
    frostAlpha = max(frostAlpha, combinedGlow * uOpacity);

    
    frostColor = mix(frostColor, vec3(1.0), uWhiteout);
    frostAlpha = mix(frostAlpha, 1.0, uWhiteout);

    
    float trailWhite = cleared * uTrailWhite;
    frostColor = mix(frostColor, vec3(1.0), trailWhite);
    frostAlpha = max(frostAlpha, trailWhite * uOpacity);

    
    
    
    frostAlpha *= meltMask;

    
    
    
    
    
    float meltRim = 4.0 * meltMask * (1.0 - meltMask);
    frostColor = mix(frostColor, vec3(1.0), meltRim);
    frostAlpha = max(frostAlpha, meltRim * uOpacity);

    vec3 finalRGB = scene.rgb * (1.0 - frostAlpha) + frostColor * frostAlpha;
    gl_FragColor  = vec4(finalRGB, scene.a);
  }
