precision mediump float;
  varying vec2 vUv;
  void main() {
    vec2 p = vUv - 0.5;
    float d = length(p) * 2.0;
    
    
    float core = smoothstep(0.22, 0.20, d);
    if (core < 0.01) discard;
    gl_FragColor = vec4(1.0, 1.0, 1.0, core);
  }
