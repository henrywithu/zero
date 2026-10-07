varying vec2 vUv;
  varying vec3 vViewNormal;
  varying vec3 vViewPosition;
  void main() {
    vUv = uv;
    vViewNormal = normalize(normalMatrix * normal);
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = mvPos.xyz;
    gl_Position = projectionMatrix * mvPos;
  }
