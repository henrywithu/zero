precision mediump float;
    uniform sampler2D tOriginal;
    uniform sampler2D tBlurred;
    uniform vec2  uFocalPoint;
    uniform float uFocalRadius;
    uniform float uFalloff;
    uniform vec2  uResolution;
    varying vec2 vUv;

    void main() {
        float aspect = uResolution.x / uResolution.y;
        vec2 delta = (vUv - uFocalPoint) * vec2(aspect, 1.0);
        float dist = length(delta);
        float blend = smoothstep(uFocalRadius, uFocalRadius + uFalloff, dist);
        gl_FragColor = mix(
            texture2D(tOriginal, vUv),
            texture2D(tBlurred, vUv),
            blend
        );
    }
