#include <emissivemap_fragment>
        // Darken the printed art in the folds with the baked AO, sampled on
        // its own UV set (vAoMapUv). Standard AO-intensity remap: aoMapIntensity
        // 1 = full effect, 0 = none.
        float _ao = texture2D( aoMap, vAoMapUv ).r;
        totalEmissiveRadiance *= 1.0 + ( _ao - 1.0 ) * aoMapIntensity;
