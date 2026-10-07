precision mediump float;
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uOuterR;
  varying vec2 vLocal;
  void main() {
    float r = length(vLocal) / uOuterR;    // 0 centre -> 1 outer edge
    // Hard outer edge + a shallow inner shadow: the band is kept close to the
    // outer edge (0.78 inner bound = less depth toward the centre); pow() dims
    // the inward ramp. The solid outer edge is preserved since pow(1, n) == 1.
    float alpha = pow(smoothstep(0.78, 0.95, r), 2.5) * uOpacity;
    // Premultiplied for the color-dodge-style blend (result = dst * (1 + src)).
    gl_FragColor = vec4(uColor * alpha, alpha);
  }
