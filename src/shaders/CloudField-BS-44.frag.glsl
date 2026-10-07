precision mediump float;
  uniform sampler2D uTexture;
  // Atlas UV transform — maps quad UV into the cloud's sub-rectangle of
  // the shared clouds atlas.
  uniform vec2 uTexOffset;
  uniform vec2 uTexScale;
  varying float vOpacity;
  varying vec2 vUv;
  void main() {
    vec2 atlasUv = vUv * uTexScale + uTexOffset;
    vec4 c = texture2D(uTexture, atlasUv);
    gl_FragColor = vec4(c.rgb, c.a * vOpacity);
  }
