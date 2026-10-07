precision highp float;

    uniform float uWaviness;
    uniform float uTime;
    uniform float uSeed;

    varying vec2 vUv;
    varying vec2 vMatcapUv;

    void main() {
        vUv = uv;

        
        float s = uSeed * 6.283;
        float p1 = uTime * 1.2 + uv.x * 5.0 + uv.y * 3.0 + s;
        float p2 = uTime * 1.8 + uv.x * 3.0 - uv.y * 4.0 + s * 1.7;
        float p3 = uTime * 0.7 + uv.y * 6.0 + s * 2.3;
        float waveZ = uWaviness * (
            sin(p1) * 3.0 + sin(p2) * 2.0 + sin(p3) * 1.5
        );

        vec3 displaced = vec3(position.x, position.y, position.z + waveZ);

        
        float dzdx = uWaviness * (cos(p1) * 5.0 * 3.0 + cos(p2) * 3.0 * 2.0);
        float dzdy = uWaviness * (cos(p1) * 3.0 * 3.0 - cos(p2) * 4.0 * 2.0 + cos(p3) * 6.0 * 1.5);
        vec3 surfNormal = normalize(vec3(-dzdx, -dzdy, 1.0));

        vec3 viewNormal = normalize(normalMatrix * surfNormal);
        vMatcapUv = viewNormal.xy * 0.5 + 0.5;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
    }
