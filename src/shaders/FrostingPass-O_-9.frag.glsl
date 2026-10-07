precision highp float;
  uniform sampler2D uHeight;
  uniform vec2  uTexelSize;
  uniform float uStrength;
  uniform float uSampleStride;   
  varying vec2 vUv;

  void main() {
    
    
    
    vec2 px = uTexelSize * uSampleStride;
    float h00 = dot(texture2D(uHeight, vUv + vec2(-px.x, -px.y)).rgb, vec3(0.333));
    float h10 = dot(texture2D(uHeight, vUv + vec2(0.0,   -px.y)).rgb, vec3(0.333));
    float h20 = dot(texture2D(uHeight, vUv + vec2( px.x, -px.y)).rgb, vec3(0.333));
    float h01 = dot(texture2D(uHeight, vUv + vec2(-px.x, 0.0)).rgb,   vec3(0.333));
    float h21 = dot(texture2D(uHeight, vUv + vec2( px.x, 0.0)).rgb,   vec3(0.333));
    float h02 = dot(texture2D(uHeight, vUv + vec2(-px.x,  px.y)).rgb, vec3(0.333));
    float h12 = dot(texture2D(uHeight, vUv + vec2(0.0,    px.y)).rgb, vec3(0.333));
    float h22 = dot(texture2D(uHeight, vUv + vec2( px.x,  px.y)).rgb, vec3(0.333));

    
    
    float gx = (h20 + 2.0 * h21 + h22) - (h00 + 2.0 * h01 + h02);
    float gy = (h02 + 2.0 * h12 + h22) - (h00 + 2.0 * h10 + h20);

    
    vec3 n = normalize(vec3(-gx * uStrength, -gy * uStrength, 1.0));

    
    gl_FragColor = vec4(n * 0.5 + 0.5, 1.0);
  }
