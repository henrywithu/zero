import type GUI from "lil-gui";
interface ScrollDriver {
  enabled: boolean;
  targetScrollPos: number;
  _activeStage: {
    scrollLength?: number;
  } | null;
}
export function createAutoScrollMode({
  scrollManager,
}: {
  scrollManager: ScrollDriver;
}) {
  const mode = {
    enabled: false,
    speed: 120,
    dispose: () => cancelAnimationFrame(frame),
  };
  let last = performance.now();
  let frame = 0;
  const tick = (now: number) => {
    const elapsed = Math.min((now - last) / 1000, 0.1);
    last = now;
    if (mode.enabled && scrollManager.enabled) {
      scrollManager.targetScrollPos = Math.min(
        scrollManager.targetScrollPos + mode.speed * elapsed,
        scrollManager._activeStage?.scrollLength ?? 0,
      );
    }
    frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
  return mode;
}
export function installAutoScrollDebugGui(
  gui: GUI,
  mode: ReturnType<typeof createAutoScrollMode>,
) {
  const folder = gui.addFolder("Auto scroll");
  folder.add(mode, "enabled");
  folder.add(mode, "speed", 20, 1000, 10);
}
