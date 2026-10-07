attribute float aSize;
  attribute float aSeed;
  uniform float uPixelRatio;
  uniform float uTime;
  uniform float uOpacity;
  varying float vAlpha;
  varying float vSeed;
  void main() {
    vec3 pos = position;
    float t = uTime + aSeed * 20.0;
    pos.x += sin(t * 0.5 + aSeed * 6.283) * 0.08;
    pos.y += sin(t * 0.7 + aSeed * 4.1) * 0.06;
    pos.z += sin(t * 0.3 + aSeed * 3.7) * 0.06;
    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * uPixelRatio * (1.0 / -mvPos.z);
    gl_Position = projectionMatrix * mvPos;
    float depth = -mvPos.z;
    vAlpha = smoothstep(3.0, 0.5, depth) * smoothstep(0.05, 0.2, depth) * uOpacity;
    vSeed = aSeed;
  }
