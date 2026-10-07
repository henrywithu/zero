import {
  ShaderMaterial as ThreeShaderMaterial,
  type Material,
  type ShaderMaterialParameters,
} from "three";
const liveMaterials = new Set<ThreeShaderMaterial>();
const replacements = new Map<string, string>();
const patchedMaterials = new Set<Material>();
const parameterizedSources = new Map<string, Record<string, string>[]>();
let shaderRevision = 0;
function currentSource(source: string | undefined): string | undefined {
  if (source === undefined) return source;
  for (const [previous, next] of replacements)
    source = source.replace(previous, next);
  return source;
}

/** Keeps the reference's numeric GLSL substitutions outside the shader file. */
export function interpolateShader(
  source: string,
  values: Record<string, string>,
): string {
  const variants = parameterizedSources.get(source) ?? [];
  variants.push(values);
  parameterizedSources.set(source, variants);
  return substitute(source, values);
}
function substitute(source: string, values: Record<string, string>): string {
  for (const [name, value] of Object.entries(values))
    source = source.replaceAll(name, value);
  return source;
}

/** Applies live GLSL injection edits when Three.js recompiles built-in materials. */
export function trackPatchedMaterial<T extends Material>(material: T): T {
  const compile = material.onBeforeCompile;
  const cacheKey = material.customProgramCacheKey();
  material.onBeforeCompile = function (shader, renderer) {
    compile.call(this, shader, renderer);
    shader.vertexShader = currentSource(shader.vertexShader)!;
    shader.fragmentShader = currentSource(shader.fragmentShader)!;
  };
  material.customProgramCacheKey = () => `${cacheKey}:zero-${shaderRevision}`;
  patchedMaterials.add(material);
  material.addEventListener("dispose", () => patchedMaterials.delete(material));
  return material;
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
      const updates: [string, string][] = [[previous, next]];
      const variants = parameterizedSources.get(previous);
      if (variants) {
        parameterizedSources.set(next, variants);
        for (const values of variants) {
          const update: [string, string] = [
            substitute(previous, values),
            substitute(next, values),
          ];
          replacements.set(...update);
          updates.push(update);
        }
      }
      for (const material of liveMaterials) {
        let vertex = material.vertexShader;
        let fragment = material.fragmentShader;
        for (const [before, after] of updates) {
          vertex = vertex.replace(before, after);
          fragment = fragment.replace(before, after);
        }
        if (
          vertex !== material.vertexShader ||
          fragment !== material.fragmentShader
        ) {
          material.vertexShader = vertex;
          material.fragmentShader = fragment;
          material.needsUpdate = true;
        }
      }
      shaderRevision++;
      for (const material of patchedMaterials) material.needsUpdate = true;
    },
  );
}
