attribute float aSize;
  attribute float aSeed;
  uniform float uPixelRatio;
  uniform float uTime;
  uniform float uZOffset;
  uniform float uOpacity;
  varying float vAlpha;
  void main() {
    vec3 pos = position;
    pos.z += uZOffset;
    pos.x += sin(uTime * 0.3 + aSeed * 6.283) * 0.15;
    pos.y += sin(uTime * 0.2 + aSeed * 4.1) * 0.1;
    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * uPixelRatio * (1.0 / -mvPos.z);
    gl_Position = projectionMatrix * mvPos;
    float depth = -mvPos.z;
    vAlpha = smoothstep(12.0, 4.0, depth) * smoothstep(0.3, 1.0, depth) * uOpacity;
  }
