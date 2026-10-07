precision mediump float;

    uniform sampler2D tDiffuse;
    uniform sampler2D uOverlayTextureA;
    uniform sampler2D uOverlayTextureB;

    uniform float uProgress;
    uniform float uOpacity;
    uniform float uEnableOverlay;
    
    
    
    
    
    uniform float uOverlayCenterReveal;

    uniform float uTime;
    uniform float uEnableNoise;
    uniform float uNoiseStrength;
    uniform sampler2D uNoiseTex;
    
    
    
    
    uniform vec2 uNoiseOffset;

    uniform vec2 uCoverScaleA;
    uniform vec2 uCoverScaleB;

    
    uniform sampler2D uGodRaysTex1;
    uniform sampler2D uGodRaysTex2;
    uniform float uGodRaysBlend;
    uniform vec2 uGodRaysCoverScale1;
    uniform vec2 uGodRaysCoverScale2;
    
    uniform vec4 uGodRaysRect1;
    uniform vec4 uGodRaysRect2;
    uniform float uGodRaysOpacity;
    uniform float uEnableGodRays;

    
    uniform float uRippleTime;
    uniform float uRippleStrength;
    uniform float uRippleHw;
    uniform float uViewportAspect;

    
    
    
    
    
    
    uniform sampler2D uHoverFrostTex;
    uniform vec2  uHoverPos;       
    uniform float uHoverRadius;    
    uniform float uHoverIntensity; 
    uniform float uHoverGlow;      
    uniform vec2  uHoverFrostCoverScale; 

    
    uniform float uExposure;
    uniform float uContrast;
    uniform float uSaturation;
    uniform float uRedTint; 

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
        vec4 sceneColor = texture2D(tDiffuse, vUv);

        vec3 finalRGB = sceneColor.rgb;

        
        
        
        if (uHoverIntensity > 0.001) {
            vec2 cm = vUv - uHoverPos;
            cm.x *= uViewportAspect;
            float dist = length(cm);
            
            
            float discMask =
                (1.0 - smoothstep(uHoverRadius * 0.95, uHoverRadius, dist))
                * uHoverIntensity;
            if (discMask > 0.001) {
                
                
                
                
                
                
                
                
                
                
                
                float glow = pow(1.0 - smoothstep(0.0, uHoverRadius, dist), 1.8);
                vec3 glowCol = vec3(1.0, 0.86, 0.62); 
                vec3 b = clamp(glowCol * glow * discMask * uHoverGlow, 0.0, 0.9);
                finalRGB = finalRGB / (1.0 - b);
            }
        }

        
        if (uEnableOverlay > 0.5 && uOpacity > 0.001) {
            vec4 pOverlay;
            if (uProgress < 0.001) {
                vec2 uvA = (vUv - 0.5) * uCoverScaleA + 0.5;
                vec4 ovA = texture2D(uOverlayTextureA, uvA);
                pOverlay = vec4(ovA.rgb * ovA.a, ovA.a);
            } else if (uProgress > 0.999) {
                vec2 uvB = (vUv - 0.5) * uCoverScaleB + 0.5;
                vec4 ovB = texture2D(uOverlayTextureB, uvB);
                pOverlay = vec4(ovB.rgb * ovB.a, ovB.a);
            } else {
                vec2 uvA = (vUv - 0.5) * uCoverScaleA + 0.5;
                vec2 uvB = (vUv - 0.5) * uCoverScaleB + 0.5;
                vec4 ovA = texture2D(uOverlayTextureA, uvA);
                vec4 ovB = texture2D(uOverlayTextureB, uvB);
                vec4 pA = vec4(ovA.rgb * ovA.a, ovA.a);
                vec4 pB = vec4(ovB.rgb * ovB.a, ovB.a);
                pOverlay = mix(pA, pB, uProgress);
            }
            pOverlay *= uOpacity;
            
            
            
            
            
            
            vec2 cm = vUv - 0.5;
            cm.x *= uViewportAspect;
            float dCenter = length(cm) * 2.0;
            float centerMask =
                1.0 - smoothstep(uOverlayCenterReveal - 4.0,
                                 uOverlayCenterReveal,
                                 dCenter);
            pOverlay *= centerMask;
            finalRGB = finalRGB * (1.0 - pOverlay.a) + pOverlay.rgb;
        }

        
        
        
        
        
        if (uEnableGodRays > 0.5 && uGodRaysOpacity > 0.001) {
            vec2 uvGr1 = (vUv - 0.5) * uGodRaysCoverScale1 + 0.5;
            vec2 uvGr2 = (vUv - 0.5) * uGodRaysCoverScale2 + 0.5;
            uvGr1 = uGodRaysRect1.xy + uvGr1 * uGodRaysRect1.zw;
            uvGr2 = uGodRaysRect2.xy + uvGr2 * uGodRaysRect2.zw;
            vec3 rays = mix(
                texture2D(uGodRaysTex1, uvGr1).rgb,
                texture2D(uGodRaysTex2, uvGr2).rgb,
                uGodRaysBlend
            );
            finalRGB += rays * uGodRaysOpacity;
        }

        
        
        
        
        if (uRippleStrength > 0.0) {
            float rt = uRippleTime;
            vec2 centered = vUv - 0.5;
            centered.x *= uViewportAspect;
            float dist = length(centered) * 2.0;
            float speed = mix(1.6, 6.0, clamp(rt / 3.0, 0.0, 1.0));
            
            
            
            float waveFront = mix(1.8, -0.9, fract(rt * speed));
            float hw = uRippleHw;
            float pulse = smoothstep(waveFront - hw, waveFront, dist)
                        * smoothstep(waveFront + hw, waveFront, dist);
            float rIntensity = smoothstep(0.0, 0.4, rt) * uRippleStrength;
            finalRGB += vec3(0.773, 1.0, 0.796) * pulse * rIntensity;
        }

        
        
        
        
        if (uEnableNoise > 0.5 && uNoiseStrength > 0.001) {
            vec2 noiseUv = gl_FragCoord.xy * 0.00390625 + uNoiseOffset;
            float n = texture2D(uNoiseTex, noiseUv).r;
            finalRGB += (n - 0.5) * uNoiseStrength;
        }

        
        finalRGB *= uExposure;
        
        
        finalRGB.g *= mix(1.0, 0.15, uRedTint);
        finalRGB.b *= mix(1.0, 0.10, uRedTint);
        float luma = dot(finalRGB, vec3(0.2126, 0.7152, 0.0722));
        finalRGB = mix(vec3(luma), finalRGB, uSaturation);
        finalRGB = clamp((finalRGB - 0.5) * uContrast + 0.5, 0.0, 1.0);
        finalRGB = linearToSRGB(finalRGB);

        gl_FragColor = vec4(finalRGB, sceneColor.a);
    }
