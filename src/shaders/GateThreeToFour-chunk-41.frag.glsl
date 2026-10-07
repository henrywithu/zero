#include <dithering_fragment>
    {
      // Group-local Z: the tunnel group rides the camera during the cruise,
      // so raw world Z would make the bands slide with scroll.
      float bq = fract((vTunnelZ - uBandOrigin) * uBandFreq + uBandPhase);
      float bdist = min(bq, 1.0 - bq);
      float bmask = (1.0 - step(uBandWidth, bdist)) * uBandStrength;
      // Transparent mode at FULL strength must DISCARD (an alpha-0 fragment
      // still writes depth and would occlude the far wall); while fading it
      // alpha-blends instead — imperceptible against the gate whiteout.
      if (uBandTransparent > 0.5 && bmask > 0.995) discard;
      gl_FragColor.rgb *= 1.0 - bmask * (1.0 - uBandTransparent);
      gl_FragColor.a   *= 1.0 - bmask * uBandTransparent;
    }
