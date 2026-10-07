if (uRippleIntensity > 0.001) {
            // uRippleResolution is in *device* pixels (CSS × pixelRatio)
            // so gl_FragCoord / uRippleResolution is true [0..1] across
            // the canvas. Aspect-correct the centered coord so the wave
            // contour is a circle, not an ellipse — keeps the origin
            // visually centered regardless of screen ratio.
            vec2 screenUv = gl_FragCoord.xy / uRippleResolution;
            vec2 centered = screenUv - 0.5;
            centered.x *= uRippleResolution.x / uRippleResolution.y;
            float dist = length(centered) * 2.0;
            float speed = mix(1.6, 6.0, clamp(uRippleTime / 3.0, 0.0, 1.0));
            // Half-wavelength offset: wave starts at outer corners (1.8)
            // and continues past the centre to -0.9 (off-screen on the
            // dist=0 side), so the fract() wrap-around lands while the
            // band is invisible — no visible flash at the centre.
            float waveFront = mix(1.8, -0.9, fract(uRippleTime * speed));
            float hw = uRippleHw;
            float pulse = smoothstep(waveFront - hw, waveFront, dist)
                        * smoothstep(waveFront + hw, waveFront, dist);
            gl_FragColor.rgb += vec3(0.773, 1.0, 0.796) * pulse * uRippleIntensity;
        }
        #include <dithering_fragment>
