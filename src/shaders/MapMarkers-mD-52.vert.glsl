uniform float uTime;
  uniform float uRiseH;
  uniform float uVh;
  attribute vec3 aInfo; // x: speed (cycles/s), y: phase, z: size (world units)
  varying float vAlpha;
  void main() {
    float t = fract(uTime * aInfo.x + aInfo.y);
    vec3 p = position;
    p.y += t * uRiseH;
    // Gentle horizontal sway, phase-desynced per particle.
    p.x += sin((t + aInfo.y) * 12.566) * uRiseH * 0.02;
    vAlpha = smoothstep(0.0, 0.15, t) * (1.0 - smoothstep(0.6, 1.0, t));
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    // Ortho: projectionMatrix[1][1] = 1 / frustum-half-height, so this keeps
    // each particle's WORLD size constant across map zoom levels.
    gl_PointSize = aInfo.z * uVh * projectionMatrix[1][1] * 0.5;
  }
