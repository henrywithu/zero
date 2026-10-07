precision mediump float;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.15, d) * vAlpha;
    gl_FragColor = vec4(0.5,0.5,0.5, alpha);
  }
