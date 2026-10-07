precision highp float;
    attribute float aStripIndex;

    uniform float uShredProgress;
    uniform float uNumStrips;
    uniform float uWaviness;
    uniform float uTime;
    uniform float uSeed;

    varying vec2 vUv;
    varying float vStripBelowAmount;
    varying float vStripId;
    varying vec2 vMatcapUv;

    
    
    
    
    float stripHash(float p) {
        p = fract(p * 0.1031);
        p *= p + 33.33;
        p *= p + p;
        return fract(p);
    }

    void main() {
        vUv = uv;

        
        float stripId = aStripIndex + uSeed * 137.0;
        vStripId = stripId;

        
        float pastAmount = clamp((uShredProgress - uv.x) / 0.4, 0.0, 1.0);
        vStripBelowAmount = pastAmount;

        
        float s = uSeed * 6.283;
        float p1 = uTime * 1.2 + uv.x * 5.0 + uv.y * 3.0 + s;
        float p2 = uTime * 1.8 + uv.x * 3.0 - uv.y * 4.0 + s * 1.7;
        float p3 = uTime * 0.7 + uv.y * 6.0 + s * 2.3;
        float idleWave = uWaviness * (
            sin(p1) * 3.0 + sin(p2) * 2.0 + sin(p3) * 1.5
        );

        
        float shredWave = 0.0;
        float fall = 0.0;
        if (pastAmount > 0.0) {
            float h1 = stripHash(stripId);
            float h2 = stripHash(stripId + 10.0);
            float h3 = stripHash(stripId + 20.0);
            shredWave = pastAmount * uWaviness * (
                sin(uTime * (1.5 + h1 * 3.0) + uv.x * (5.0 + h2 * 8.0)) * (3.0 + h3 * 3.0)
              + sin(uTime * (2.2 + h2 * 2.0) + uv.y * (4.0 + h1 * 6.0)) * (2.0 + h1 * 2.0)
              + sin(uTime * (3.1 + h3 * 1.5) + uv.x * (9.0 + h3 * 5.0)) * (1.5 + h2 * 1.5)
            );
            float easedPast = pastAmount * pastAmount;
            fall = easedPast * (0.25 + stripHash(stripId + 3.3) * 0.25);

            
            float center = (uNumStrips - 1.0) * 0.5;
            float distFromCenter = (aStripIndex - center) / max(center, 1.0);
            fall -= easedPast * distFromCenter * 0.3;
        }

        float waveZ = idleWave + shredWave;
        vec3 displaced = vec3(position.x, position.y - fall, position.z + waveZ);

        
        if (pastAmount > 0.0) {
            float h4 = stripHash(stripId + 30.0);
            float h5 = stripHash(stripId + 40.0);
            float angle = pastAmount * pastAmount * (h4 * 2.0 - 1.0) * 3.0; 
            float stripCenterY = (aStripIndex + 0.5) / uNumStrips - 0.5;
            float localY = displaced.y - stripCenterY;
            float localZ = displaced.z;
            float cosA = cos(angle);
            float sinA = sin(angle);
            displaced.y = stripCenterY + localY * cosA - localZ * sinA;
            displaced.z = localY * sinA + localZ * cosA;

            
            float angleX = pastAmount * pastAmount * (h5 * 2.0 - 1.0) * 2.0;
            float localX = displaced.x;
            float localZ2 = displaced.z;
            float cosB = cos(angleX);
            float sinB = sin(angleX);
            displaced.x = localX * cosB - localZ2 * sinB;
            displaced.z = localX * sinB + localZ2 * cosB;
        }

        
        float dzdx = uWaviness * (cos(p1) * 5.0 * 3.0 + cos(p2) * 3.0 * 2.0);
        float dzdy = uWaviness * (cos(p1) * 3.0 * 3.0 - cos(p2) * 4.0 * 2.0 + cos(p3) * 6.0 * 1.5);
        float normalScale = 1.0;
        vec3 surfNormal = normalize(vec3(-dzdx * normalScale, -dzdy * normalScale, 1.0));

        vec3 viewNormal = normalize(normalMatrix * surfNormal);
        vMatcapUv = viewNormal.xy * 0.5 + 0.5;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
    }
