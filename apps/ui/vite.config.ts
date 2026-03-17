import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";
import devtoolsJson from "vite-plugin-devtools-json";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

const projects = ["./deno.json"];

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: "../../dist",
    emptyOutDir: true,
  },
  plugins: [wasm(), devtoolsJson(), tsconfigPaths({ projects }), tailwindcss()],
  worker: {
    format: "es",
  },
  optimizeDeps: {
    // Don't optimize these packages as they contain web workers and WASM files.
    // https://github.com/vitejs/vite/issues/11672#issuecomment-1415820673
    exclude: ["@journeyapps/wa-sqlite", "@powersync/web"],
    include: [],
  },
});
