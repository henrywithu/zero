attribute float aOpacity;
  varying float vOpacity;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vOpacity = aOpacity;
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
  }
