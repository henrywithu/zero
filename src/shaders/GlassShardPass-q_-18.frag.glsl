precision mediump float;
  varying vec3 vViewNormal;
  varying vec2 vUv;
  void main() {
    vec3 n = normalize(vViewNormal);
    gl_FragColor = vec4(n.xy * 0.5 + 0.5, fract(vUv));
  }
