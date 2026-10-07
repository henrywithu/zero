precision mediump float;
  uniform vec3 uColor;
  uniform float uAlpha;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.1, d) * vAlpha * uAlpha;
    // Premultiplied for the screen-style blend (see the ripples).
    gl_FragColor = vec4(uColor * a, a);
  }
