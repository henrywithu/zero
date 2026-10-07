precision mediump float;
    uniform sampler2D tDiffuse;
    uniform vec2 uHalfPixel;
    varying vec2 vUv;

    void main() {
        vec4 sum = vec4(0.0);
        
        sum += texture2D(tDiffuse, vUv + vec2(-uHalfPixel.x * 2.0, 0.0));
        sum += texture2D(tDiffuse, vUv + vec2( uHalfPixel.x * 2.0, 0.0));
        sum += texture2D(tDiffuse, vUv + vec2(0.0, -uHalfPixel.y * 2.0));
        sum += texture2D(tDiffuse, vUv + vec2(0.0,  uHalfPixel.y * 2.0));
        
        sum += texture2D(tDiffuse, vUv + vec2(-uHalfPixel.x, -uHalfPixel.y)) * 2.0;
        sum += texture2D(tDiffuse, vUv + vec2( uHalfPixel.x, -uHalfPixel.y)) * 2.0;
        sum += texture2D(tDiffuse, vUv + vec2(-uHalfPixel.x,  uHalfPixel.y)) * 2.0;
        sum += texture2D(tDiffuse, vUv + vec2( uHalfPixel.x,  uHalfPixel.y)) * 2.0;
        gl_FragColor = sum / 12.0;
    }
