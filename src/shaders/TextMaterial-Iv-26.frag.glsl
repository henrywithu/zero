precision mediump float;

    uniform sampler2D uTextureA;
    uniform sampler2D uTextureB;
    
    
    
    
    uniform vec2 uTexOffsetA;
    uniform vec2 uTexScaleA;
    uniform vec2 uTexOffsetB;
    uniform vec2 uTexScaleB;
    uniform float uProgress;
    uniform float uOpacity;

    
    
    
    
    uniform sampler2D uAlphaMap;
    uniform vec2 uAlphaOffset;
    uniform vec2 uAlphaScale;

    #ifdef USE_RIPPLE
        uniform float uRippleTime;
        uniform float uRippleIntensity;
        uniform vec2  uRippleResolution;
        uniform float uRippleHw;
    #endif

    varying vec2 vUv;

    void main() {
        
        
        
        vec4 colorA = texture2D(uTextureA, vUv * uTexScaleA + uTexOffsetA);
        vec4 colorB = texture2D(uTextureB, vUv * uTexScaleB + uTexOffsetB);

        
        
        vec4 pA = vec4(colorA.rgb * colorA.a, colorA.a);
        vec4 pB = vec4(colorB.rgb * colorB.a, colorB.a);
        vec4 pMix = mix(pA, pB, uProgress);

        
        
        
        float alphaMask = texture2D(uAlphaMap, vUv * uAlphaScale + uAlphaOffset).r;
        float outA = pMix.a * uOpacity * alphaMask;
        vec3 outRGB = pMix.rgb * uOpacity * alphaMask;

        #ifdef USE_RIPPLE
            if (uRippleIntensity > 0.001) {
                vec2 screenUv = gl_FragCoord.xy / uRippleResolution;
                vec2 centered = screenUv - 0.5;
                centered.x *= uRippleResolution.x / uRippleResolution.y;
                float dist = length(centered) * 2.0;
                float speed = mix(1.6, 6.0, clamp(uRippleTime / 3.0, 0.0, 1.0));
                float waveFront = mix(1.8, -0.9, fract(uRippleTime * speed));
                float hw = uRippleHw;
                float pulse = smoothstep(waveFront - hw, waveFront, dist)
                            * smoothstep(waveFront + hw, waveFront, dist);
                outRGB += vec3(0.773, 1.0, 0.796) * pulse * uRippleIntensity * outA;
            }
        #endif

        gl_FragColor = vec4(outRGB, outA);
    }
