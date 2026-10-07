#include <map_fragment>
            // Tile inside the atlas sub-rectangle: take the fract() of
            // the tiled UV to get a [0,1) coord, then remap into the
            // shadow region. Atlas is ClampToEdgeWrapping, so this is
            // what makes the seamless repeat work.
            vec2 pre = vMapUv * uShadowTiling + uShadowOffset;
            vec2 tiled = fract(pre);
            vec2 cloudUv = tiled * uShadowAtlasScale + uShadowAtlasOffset;
            // Use pre-fract derivatives for mip selection. Auto-derivatives
            // on cloudUv would explode at every fract() wrap (UV jumps
            // from ~0.999 to ~0.001 between adjacent fragments), pick the
            // coarsest mip there, and average a huge chunk of the atlas —
            // that's the grey streak. dFdx(pre) is smooth across seams.
            vec2 dx = dFdx(pre) * uShadowAtlasScale;
            vec2 dy = dFdy(pre) * uShadowAtlasScale;
            vec3 cloudRgb = texture2DGradEXT(uShadowMap, cloudUv, dx, dy).rgb;
            float density = 1.0 - dot(cloudRgb, vec3(0.299, 0.587, 0.114));
            diffuseColor.rgb *= 1.0 - density * uShadowStrength;
