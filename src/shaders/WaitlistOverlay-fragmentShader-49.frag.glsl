uniform vec3 uColor;
        varying float vT;
        varying float vSeed;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.12, d) * (1.0 - vT);
          if (a < 0.003) discard;
          // white-hot centre falling off to the tint at the rim
          vec3 col = mix(vec3(1.0), uColor, smoothstep(0.0, 0.4, d));
          gl_FragColor = vec4(col, a);
        }
