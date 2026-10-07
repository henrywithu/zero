precision mediump float;
    uniform sampler2D tDiffuse;
    uniform vec2 uHalfPixel;
    varying vec2 vUv;

    void main() {
        vec4 sum = texture2D(tDiffuse, vUv) * 4.0;
        sum += texture2D(tDiffuse, vUv - uHalfPixel);
        sum += texture2D(tDiffuse, vUv + uHalfPixel);
        sum += texture2D(tDiffuse, vUv + vec2(uHalfPixel.x, -uHalfPixel.y));
        sum += texture2D(tDiffuse, vUv - vec2(uHalfPixel.x, -uHalfPixel.y));
        gl_FragColor = sum / 8.0;
    }
