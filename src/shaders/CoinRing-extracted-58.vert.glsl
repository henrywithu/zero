attribute vec3 aOffset;
  attribute vec3 aVelocity;
  attribute float aPhase;
  attribute vec4 aPetalRect;
  attribute float aScale;
  attribute vec2 aRotSpeed;

  uniform float uTime;
  uniform float uSwirlTime;
  uniform vec3 uBounds;
  uniform vec3 uBoundsCenter;
  uniform float uEntry;

  varying vec2 vUv;
  varying vec4 vPetalRect;
  varying float vOpacity;
  varying float vBrightness;
  varying float vSaturation;
  varying float vFresnel;

  vec3 wrapPos(vec3 p, vec3 b) {
    return mod(p + b, 2.0 * b) - b;
  }

  void main() {
    // --- Position pipeline operates in box-centered coords (cp),
    // so wrap / swirl / fade are symmetric about the bounding box's
    // center even when uBoundsCenter shifts the box off-origin.
    vec3 cp = wrapPos(aOffset + aVelocity * uTime - uBoundsCenter, uBounds);

    // --- Entry: petals start offset to the right, slide into swirl ---
    float entryStagger = aPhase / 6.283;
    float entryT = clamp((uEntry - entryStagger * 0.3) / 0.7, 0.0, 1.0);
    float entryEase = entryT * entryT * (3.0 - 2.0 * entryT);
    cp.x += (1.0 - entryEase) * uBounds.x * 3.0;

    // --- Swirl: orbit around the box center (Y axis through uBoundsCenter).
    // uSwirlTime (CPU-integrated dt * entryEase) instead of uTime * entryEase:
    // multiplying raw elapsed time by the scroll-driven ease made the angle's
    // sensitivity to a scroll step grow with time idled — minutes of sitting
    // still turned the next scroll into a violent spin. The integral keeps
    // d(angle)/d(scroll) zero; entry only ramps the swirl RATE. ---
    float swirlAngle = uSwirlTime * (__ZERO_PARAM_0__ + aPhase * __ZERO_PARAM_1__);
    float cs = cos(swirlAngle), ss = sin(swirlAngle);
    cp.xz = mat2(cs, -ss, ss, cs) * cp.xz;

    // --- Turbulence: layered sine displacement for organic motion ---
    cp.x += sin(cp.y * __ZERO_PARAM_2__ + uTime * __ZERO_PARAM_3__ + aPhase) * __ZERO_PARAM_4__ * entryEase;
    cp.z += sin(cp.y * __ZERO_PARAM_5__ + uTime * __ZERO_PARAM_6__ * 0.9 + aPhase * 1.7) * __ZERO_PARAM_7__ * entryEase;
    cp.y += sin(cp.x * __ZERO_PARAM_8__ + uTime * __ZERO_PARAM_9__ * 0.7 + aPhase * 0.5) * __ZERO_PARAM_10__ * 0.5 * entryEase;

    // --- Fade petals near bounding edges for soft wrap (all axes) ---
    float fadeX = smoothstep(0.0, 0.3, (uBounds.x - abs(cp.x)) / uBounds.x);
    float fadeY = smoothstep(0.0, 0.3, (uBounds.y - abs(cp.y)) / uBounds.y);
    float fadeZ = smoothstep(0.0, 0.3, (uBounds.z - abs(cp.z)) / uBounds.z);
    vOpacity = fadeX * fadeY * fadeZ;

    // --- Shift back to world coordinates for downstream vertex math.
    vec3 worldOffset = cp + uBoundsCenter;

    // --- Early-out: collapse invisible petals behind camera ---
    if (vOpacity < 0.001) {
      gl_Position = vec4(0.0, 0.0, -2.0, 1.0);
      return;
    }

    // --- Local vertex: scale + waviness (compute waveArg once) ---
    vec3 pos = position * aScale;
    float waveArg = position.x * __ZERO_PARAM_11__ + uTime * __ZERO_PARAM_12__ + aPhase;
    pos.z += sin(waveArg) * __ZERO_PARAM_13__ * aScale;

    // --- Tumbling rotation (Ry * Rx) ---
    float ax = aPhase + uTime * aRotSpeed.x;
    float ay = aPhase * 1.3 + uTime * aRotSpeed.y;
    float cx = cos(ax), sx = sin(ax);
    float cy = cos(ay), sy = sin(ay);

    mat3 rot = mat3(
       cy,     sy * sx,  sy * cx,
       0.0,    cx,      -sx,
      -sy,     cy * sx,  cy * cx
    );

    pos = rot * pos;

    // --- Fresnel: deformed normal → view dot for rim lighting ---
    float dzdx = cos(waveArg) * __ZERO_PARAM_14__ * __ZERO_PARAM_15__ * aScale;
    vec3 worldNormal = normalize(rot * vec3(-dzdx, 0.0, 1.0));
    vec3 worldPos = (modelMatrix * vec4(pos + worldOffset, 1.0)).xyz;
    vec3 viewDir = normalize(cameraPosition - worldPos);
    float f = 1.0 - abs(dot(worldNormal, viewDir));
    vFresnel = f * f;

    pos += worldOffset;

    vUv = uv;
    vPetalRect = aPetalRect;
    vBrightness = 0.7 + fract(aPhase * 3.17) * 0.6;
    vSaturation = 0.6 + fract(aPhase * 5.43) * 0.8;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
