attribute vec3 aDir;
        attribute float aSeed;
        uniform float uTime;
        uniform float uSpread;
        uniform float uSize;
        varying float vT;
        varying float vSeed;
        void main() {
          float sp = mix(0.55, 1.0, fract(aSeed * 13.7));
          float t = clamp(uTime / sp, 0.0, 1.0);
          vT = t;
          vSeed = aSeed;
          float e = 1.0 - pow(1.0 - t, 3.0); // easeOutCubic expansion
          vec3 p = aDir * e * uSpread;
          p.y += t * t * 0.5; // sparks drift upward as they die
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = uSize * (1.0 - t * 0.8) * mix(0.5, 1.5, fract(aSeed * 7.3)) / -mv.z;
          gl_Position = projectionMatrix * mv;
        }
