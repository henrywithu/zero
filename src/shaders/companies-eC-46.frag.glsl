precision mediump float;
  varying vec2 vUv;
  void main() {
    vec2 p = vUv - 0.5;
    float d = length(p) * 2.0;
    if (d > 0.55) discard;
    
    
    float halo = smoothstep(0.50, 0.46, d) * 0.30;
    gl_FragColor = vec4(1.0, 1.0, 1.0, halo);
  }
