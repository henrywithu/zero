import type GUI from "lil-gui";
import type { ScrollManager } from "./ScrollManager";

interface TextInterval {
  appearAt: number;
  disappearAt?: number;
}
interface Timeline {
  scrollLength: number;
  _activeIndex: number;
  _segmentBounds: { start: number; end: number }[];
  segments: { id: string }[];
  ctx: { components?: { textLayout?: { itemsConfig?: TextInterval[] } } };
}
interface AutoScrollDriver {
  _activeStage: Timeline | null;
  _isAutoScrolling: boolean;
  _scrollClampMin: number | null;
  _scrollClampMax: number | null;
  scrollPos: number;
  startAutoScroll(target: number, duration: number): Promise<void>;
}
const excludedStages = new Set(["stage2"]);

/** Original lazy-loaded debug control, recovered from autoScrollMode-a9ywvrmh.js. */
export function createAutoScrollMode({
  scrollManager,
}: {
  scrollManager: ScrollManager;
}) {
  const driver = scrollManager as unknown as AutoScrollDriver;
  const params = {
    enabled: false,
    stepVh: 30,
    duration: 2,
    allowBackward: false,
    debugLog: false,
  };
  let installed = false,
    lastTouchY = 0;
  function anchors(): number[] | null {
    const timeline = driver._activeStage;
    if (
      !timeline ||
      !timeline._segmentBounds ||
      !timeline.ctx ||
      timeline._activeIndex == null
    )
      return null;
    const segment = timeline.segments?.[timeline._activeIndex];
    if (segment && excludedStages.has(segment.id)) return null;
    const bounds = timeline._segmentBounds[timeline._activeIndex];
    if (!bounds) return null;
    const length = bounds.end - bounds.start;
    if (!(length > 0)) return null;
    const config = timeline.ctx.components?.textLayout?.itemsConfig;
    if (!Array.isArray(config) || config.length === 0) return null;
    const intervals = config
      .filter((item) => Number.isFinite(item.appearAt))
      .map((item) => ({
        a: item.appearAt,
        d: Number.isFinite(item.disappearAt) ? item.disappearAt! : 1,
      }))
      .sort((a, b) => a.a - b.a);
    if (!intervals.length) return null;
    const merged: { a: number; d: number }[] = [];
    let current: { a: number; d: number } | null = null;
    for (const interval of intervals) {
      if (current && interval.a < current.d) {
        current.a = Math.max(current.a, interval.a);
        current.d = Math.min(current.d, interval.d);
      } else {
        if (current) merged.push(current);
        current = { ...interval };
      }
    }
    if (current) merged.push(current);
    const positions = merged.map(
      (interval) =>
        bounds.start +
        Math.min(interval.a + 0.03, (interval.a + interval.d) / 2) * length,
    );
    positions.push(bounds.end);
    return positions;
  }
  function step(direction: number): void {
    if (
      !params.enabled ||
      !driver._activeStage ||
      driver._isAutoScrolling ||
      (direction < 0 && !params.allowBackward)
    )
      return;
    const length = driver._activeStage.scrollLength || 1;
    const minimum = Math.max(0, driver._scrollClampMin ?? 0);
    const maximum = Math.min(length, driver._scrollClampMax ?? length);
    const position = driver.scrollPos,
      stops = anchors();
    let target: number | undefined;
    if (stops) {
      if (direction > 0)
        target = stops.find((value) => value > position + 2) ?? maximum;
      else {
        for (let i = stops.length - 1; i >= 0; i--)
          if (stops[i] < position - 2) {
            target = stops[i];
            break;
          }
        target ??= minimum;
      }
    } else
      target =
        position + direction * params.stepVh * (window.innerHeight || 800);
    target = Math.min(maximum, Math.max(minimum, target));
    if (Math.abs(target - position) < 1) {
      if (params.debugLog)
        console.log(
          `[autoScroll] no-op — already at ${direction > 0 ? "max" : "min"} (from=${position.toFixed(0)})`,
        );
      return;
    }
    if (params.debugLog)
      console.log(
        `[autoScroll] step direction=${direction} mode=${stops ? `anchors(${stops.length})` : "fixed-vh"} from=${position.toFixed(0)} → target=${target.toFixed(0)} (Δ=${(target - position).toFixed(0)})`,
      );
    void driver.startAutoScroll(target, params.duration);
  }
  const wheel = (event: WheelEvent) => {
    if (
      !params.enabled ||
      !Number.isFinite(event.deltaY) ||
      Math.abs(event.deltaY) < 1
    )
      return;
    step(event.deltaY > 0 ? 1 : -1);
  };
  const touchStart = (event: TouchEvent) => {
    if (!params.enabled || !event.touches?.length) return;
    const y = event.touches[0].clientY;
    if (Number.isFinite(y)) lastTouchY = y;
  };
  const touchMove = (event: TouchEvent) => {
    if (!params.enabled || !event.touches?.length || driver._isAutoScrolling)
      return;
    const y = event.touches[0].clientY;
    if (!Number.isFinite(y) || !Number.isFinite(lastTouchY)) return;
    const delta = lastTouchY - y;
    if (Math.abs(delta) < 6) return;
    lastTouchY = y;
    step(delta > 0 ? 1 : -1);
  };
  function enable(): void {
    params.enabled = true;
    if (installed) return;
    installed = true;
    window.addEventListener("wheel", wheel, { passive: true, capture: true });
    window.addEventListener("touchstart", touchStart, {
      passive: true,
      capture: true,
    });
    window.addEventListener("touchmove", touchMove, {
      passive: true,
      capture: true,
    });
  }
  function disable(): void {
    params.enabled = false;
    if (!installed) return;
    installed = false;
    window.removeEventListener("wheel", wheel, { capture: true });
    window.removeEventListener("touchstart", touchStart, { capture: true });
    window.removeEventListener("touchmove", touchMove, { capture: true });
  }
  return { params, enable, disable, dispose: disable };
}
export function installAutoScrollDebugGui(
  gui: GUI,
  mode: ReturnType<typeof createAutoScrollMode>,
): GUI {
  const folder = gui.addFolder("Auto-Scroll Mode");
  folder
    .add(mode.params, "enabled")
    .name("Enabled")
    .onChange((enabled: boolean) => (enabled ? mode.enable() : mode.disable()));
  folder.add(mode.params, "stepVh", 5, 300, 5).name("Fallback step (vh)");
  folder.add(mode.params, "duration", 0.3, 5, 0.1).name("Duration (s)");
  folder.add(mode.params, "allowBackward").name("Allow Backward");
  folder.add(mode.params, "debugLog").name("Debug Log");
  return folder;
}
