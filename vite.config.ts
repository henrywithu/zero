import { defineConfig, type Plugin } from "vite";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

function shaderHmr(): Plugin {
  const directory = resolve("src/shaders");
  const sources = new Map(
    readdirSync(directory).map((name) => {
      const file = resolve(directory, name);
      return [file, readFileSync(file, "utf8")];
    }),
  );
  return {
    name: "zero-shader-hmr",
    async handleHotUpdate(context) {
      if (!context.file.endsWith(".glsl")) return;
      const next = await context.read();
      const previous = sources.get(context.file);
      sources.set(context.file, next);
      if (previous !== undefined) {
        context.server.ws.send({
          type: "custom",
          event: "zero:shader-update",
          data: { previous, next },
        });
        return [];
      }
    },
  };
}

export default defineConfig({
  plugins: [shaderHmr()],
  server: { host: "0.0.0.0", port: 5173 },
  build: {
    target: "es2022",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("/node_modules/three/")) return "three";
          if (id.includes("/node_modules/gsap/")) return "animation";
          if (id.includes("/node_modules/howler/")) return "audio";
        },
      },
    },
  },
});
