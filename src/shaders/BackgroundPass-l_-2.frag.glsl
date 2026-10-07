precision mediump float;

    uniform sampler2D tDiffuse;
    uniform sampler2D uTextureA;
    uniform sampler2D uTextureB;
    uniform float uProgress;
    uniform float uOpacity;
    uniform float uLinearizeA;
    uniform float uLinearizeB;
    uniform vec2 uCoverScaleA;
    uniform vec2 uCoverScaleB;
    uniform float uZoom; 

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    uniform float uParallaxOn;
    uniform float uParallaxSlot; 
    uniform sampler2D uAtlas;
    uniform vec2 uAtlasCell;   
    uniform vec2 uAtlasInset;  
    uniform vec2 uParallax;    
    uniform float uParallaxAmp; 
    
    
    
    uniform vec2 uBgParallax;
    uniform float uBgParallaxAmp;
    uniform float uViewportAspect; 

    varying vec2 vUv;

    
    vec3 sRGBToLinear(vec3 c) {
        return pow(max(c, 0.0), vec3(2.2));
    }

    
    
    
    
    
    
    
    
    
    
    #define NUM_GARDEN_LAYERS 6
    uniform vec4  uLayerRect[NUM_GARDEN_LAYERS];
    uniform vec2  uLayerHalfSize[NUM_GARDEN_LAYERS]; 
    uniform vec2  uLayerCenter[NUM_GARDEN_LAYERS];   
    uniform float uLayerDepth[NUM_GARDEN_LAYERS];    
    
    
    
    uniform float uGardenBright;
    uniform float uGardenWhitewash;
    uniform float uGardenBloom;

    vec4 gardenLayer(vec4 r, vec2 hsRaw, vec2 c, float d) {
        vec2 hs = vec2(hsRaw.x / uViewportAspect, hsRaw.y); 
        vec2 shift = uParallax * (uParallaxAmp * d);
        vec2 p = (vUv - c - shift) / (2.0 * hs) + 0.5;
        if (p.x < 0.0 || p.x > 1.0 || p.y < 0.0 || p.y > 1.0) return vec4(0.0);
        return texture2D(uAtlas, r.xy + p * r.zw);
    }

    
    
    
    
    
    
    vec3 parallaxStack(vec2 base) {
        
        
        vec2 hs0 = vec2(uLayerHalfSize[0].x / uViewportAspect, uLayerHalfSize[0].y);
        vec2 sh0 = uParallax * (uParallaxAmp * uLayerDepth[0]);
        vec2 p0 = clamp((vUv - uLayerCenter[0] - sh0) / (2.0 * hs0) + 0.5, 0.0, 1.0);
        vec3 acc = texture2D(uAtlas, uLayerRect[0].xy + p0 * uLayerRect[0].zw).rgb;
        
        vec4 l;
        l = gardenLayer(uLayerRect[1], uLayerHalfSize[1], uLayerCenter[1], uLayerDepth[1]); acc = mix(acc, l.rgb, l.a);
        l = gardenLayer(uLayerRect[2], uLayerHalfSize[2], uLayerCenter[2], uLayerDepth[2]); acc = mix(acc, l.rgb, l.a);
        l = gardenLayer(uLayerRect[3], uLayerHalfSize[3], uLayerCenter[3], uLayerDepth[3]); acc = mix(acc, l.rgb, l.a);
        l = gardenLayer(uLayerRect[4], uLayerHalfSize[4], uLayerCenter[4], uLayerDepth[4]); acc = mix(acc, l.rgb, l.a);
        l = gardenLayer(uLayerRect[5], uLayerHalfSize[5], uLayerCenter[5], uLayerDepth[5]); acc = mix(acc, l.rgb, l.a);

        
        
        vec3 col = acc * uGardenBright;
        
        col = mix(col, vec3(1.0), uGardenWhitewash);
        
        
        
        
        float lum = dot(col, vec3(0.299, 0.587, 0.114));
        float glow = smoothstep(0.42, 1.0, lum);
        col += glow * glow * uGardenBloom;
        return col;
    }

    
    
    
    vec4 sampleBgA() {
        if (uParallaxOn > 0.5 && uParallaxSlot < 0.5) {
            return vec4(parallaxStack(vUv - 0.5), 1.0);
        }
        
        
        
        vec2 uvA = (vUv - 0.5) * uCoverScaleA * uZoom * (1.0 - 2.0 * uBgParallaxAmp)
                 + uBgParallax * uBgParallaxAmp + 0.5;
        vec4 colorA = texture2D(uTextureA, uvA);
        if (uLinearizeA > 0.5) colorA.rgb = sRGBToLinear(colorA.rgb);
        return vec4(colorA.rgb * colorA.a, colorA.a);
    }

    
    
    vec4 sampleBgB() {
        if (uParallaxOn > 0.5 && uParallaxSlot > 0.5) {
            return vec4(parallaxStack(vUv - 0.5), 1.0);
        }
        
        
        
        vec2 uvB = (vUv - 0.5) * uCoverScaleB * uZoom * (1.0 - 2.0 * uBgParallaxAmp)
                 + uBgParallax * uBgParallaxAmp + 0.5;
        vec4 colorB = texture2D(uTextureB, uvB);
        if (uLinearizeB > 0.5) colorB.rgb = sRGBToLinear(colorB.rgb);
        return vec4(colorB.rgb * colorB.a, colorB.a);
    }

    void main() {
        vec4 sceneColor = texture2D(tDiffuse, vUv);

        
        vec4 pBg;
        if (uProgress < 0.001) {
            pBg = sampleBgA();
        } else if (uProgress > 0.999) {
            pBg = sampleBgB();
        } else {
            pBg = mix(sampleBgA(), sampleBgB(), uProgress);
        }
        pBg *= uOpacity;

        vec3 finalRGB = sceneColor.rgb + (pBg.rgb * (1.0 - sceneColor.a));

        gl_FragColor = vec4(finalRGB, 1.0);
    }
