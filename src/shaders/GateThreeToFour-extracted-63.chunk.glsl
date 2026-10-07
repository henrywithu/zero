#include <emissivemap_fragment>
    {
      // Band centre at fract()==0, travelling toward -Z (out of the tunnel,
      // toward the viewer) as time grows; min(q, 1-q) is the wrap-seamless
      // distance to the centre.
      float q = fract(vTunnelZ * uPulseFreq + uPulseTime);
      float bd = min(q, 1.0 - q);
      float band = 1.0 - smoothstep(0.0, uPulseWidth, bd);
      totalEmissiveRadiance *= 1.0 + uPulseGain * band;
    }
    {
      // Glow ring at the exit plane's world Z — ADDS uPlaneGlowColor emissive
      // in a band around uPlaneGlowZ, brightening as the plane fades in.
      float gd = abs(vTunnelZ - uPlaneGlowZ);
      float gband = 1.0 - smoothstep(0.0, uPlaneGlowWidth, gd);
      totalEmissiveRadiance += uPlaneGlowColor * (uPlaneGlowStrength * gband);
    }
