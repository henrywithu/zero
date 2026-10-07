import type { Camera, Material, Object3D, WebGLRenderer } from "three";

interface RendererProperties {
  properties: {
    get(material: Material): { currentProgram?: { isReady(): boolean } };
  };
}

/** r160 compileAsync assumes every pending material survives until compilation.
 * Direct stage navigation can dispose them first. Keep the original polling
 * behavior while treating disposed programs as no longer pending.
 */
export async function precompileScene(
  renderer: WebGLRenderer,
  scene: Object3D,
  camera: Camera,
): Promise<void> {
  const materials = renderer.compile(scene, camera) as unknown as Set<Material>;
  const properties = (renderer as unknown as RendererProperties).properties;
  while (materials.size > 0) {
    for (const material of materials) {
      const program = properties.get(material).currentProgram;
      if (!program || program.isReady()) materials.delete(material);
    }
    if (materials.size > 0)
      await new Promise<void>((resolve) => setTimeout(resolve, 10));
  }
}
