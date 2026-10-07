import {
  ShaderMaterial as ThreeShaderMaterial,
  type ShaderMaterialParameters,
} from "three";
const liveMaterials = new Set<ThreeShaderMaterial>();
const replacements = new Map<string, string>();
function currentSource(source: string | undefined): string | undefined {
  if (source === undefined) return source;
  for (const [previous, next] of replacements)
    source = source.replace(previous, next);
  return source;
}

/** Tracks shader materials so GLSL edits apply without losing scene state. */
export class ShaderMaterial extends ThreeShaderMaterial {
  constructor(parameters?: ShaderMaterialParameters) {
    super(
      parameters && {
        ...parameters,
        vertexShader: currentSource(parameters.vertexShader),
        fragmentShader: currentSource(parameters.fragmentShader),
      },
    );
    liveMaterials.add(this);
    this.addEventListener("dispose", () => liveMaterials.delete(this));
  }
}
if (import.meta.hot) {
  import.meta.hot.on(
    "zero:shader-update",
    ({ previous, next }: { previous: string; next: string }) => {
      replacements.set(previous, next);
      for (const material of liveMaterials) {
        const vertex = material.vertexShader.replace(previous, next);
        const fragment = material.fragmentShader.replace(previous, next);
        if (
          vertex !== material.vertexShader ||
          fragment !== material.fragmentShader
        ) {
          material.vertexShader = vertex;
          material.fragmentShader = fragment;
          material.needsUpdate = true;
        }
      }
    },
  );
}
