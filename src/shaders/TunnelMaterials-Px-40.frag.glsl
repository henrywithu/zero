precision mediump float;
  varying float vAlpha;
  varying float vSeed;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.1, d) * vAlpha;
    
    vec3 col = mix(vec3(1.0, 0.3, 0.05), vec3(1.0, 0.5, 0.08), vSeed);
    gl_FragColor = vec4(col, alpha);
  }
