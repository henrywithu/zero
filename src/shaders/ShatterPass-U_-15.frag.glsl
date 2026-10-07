precision mediump float;
  
  
  uniform sampler2D uMapA;
  uniform sampler2D uMapB;
  uniform float uBlend;
  uniform float uFresnelPower;
  varying vec2 vUv;
  varying vec3 vViewNormal;
  varying vec3 vViewPosition;

  void main() {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  }
