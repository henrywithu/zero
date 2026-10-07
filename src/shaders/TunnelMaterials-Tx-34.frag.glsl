precision highp float;

    uniform sampler2D uTexture;
    uniform sampler2D uMatcap;
    uniform float uOpacity;
    uniform float uNumStrips;
    uniform float uMatcapStrength;
    uniform float uBrightness;
    
    
    uniform vec2 uTexOffset;
    uniform vec2 uTexScale;

    varying vec2 vUv;
    varying float vStripBelowAmount;
    varying float vStripId;
    varying vec2 vMatcapUv;

    
    float tearHash(float p) {
        p = fract(p * 0.1031);
        p *= p + 33.33;
        p *= p + p;
        return fract(p);
    }

    float tearNoise(float p) {
        float i = floor(p);
        float f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(tearHash(i), tearHash(i + 1.0), f);
    }

    float tearFbm(float p) {
        return tearNoise(p) * 0.5
             + tearNoise(p * 2.0 + 5.7) * 0.3
             + tearNoise(p * 4.0 + 11.3) * 0.2;
    }

    void main() {
        
        if (vStripBelowAmount > 0.01) {
            float localV = fract(vUv.y * uNumStrips);
            float tearDepth = 0.15 * smoothstep(0.0, 0.3, vStripBelowAmount);
            float seed = vStripId * 13.7;

            float tearBottom = tearFbm(vUv.x * 35.0 + seed) * tearDepth;
            float tearTop = tearFbm(vUv.x * 35.0 + seed + 100.0) * tearDepth;

            if (localV < tearBottom || localV > 1.0 - tearTop) {
                discard;
            }
        }

        
        vec2 mcUv = gl_FrontFacing ? vMatcapUv : vec2(1.0 - vMatcapUv.x, 1.0 - vMatcapUv.y);
        vec3 matcapColor = texture2D(uMatcap, mcUv).rgb;
        vec3 lighting = mix(vec3(1.0), matcapColor, uMatcapStrength) * uBrightness;

        
        if (!gl_FrontFacing) {
            vec3 backBase = vec3(0.341, 0.333, 0.286);
            gl_FragColor = vec4(backBase * lighting, uOpacity);
            return;
        }

        vec2 atlasUv = vUv * uTexScale + uTexOffset;
        vec4 texColor = texture2D(uTexture, atlasUv);
        gl_FragColor = vec4(texColor.rgb * lighting, texColor.a * uOpacity);
    }
