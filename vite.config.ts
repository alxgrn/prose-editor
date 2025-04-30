import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      tsconfigPath: "./tsconfig.build.json",
    }),
    libInjectCss(),
  ],
  build: {
    sourcemap: true,
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, "lib/index.ts"),
      name: "ProseEditor",
      formats: ["es", "umd"],
      fileName: (format) => `prose-editor.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "@alxgrn/telefrag-ui"],//"highlight.js"],
      output: {
        globals: {
          "react": "React",
          "react-dom": "ReactDOM",
          "@alxgrn/telefrag-ui": "@alxgrn/telefrag-ui",
          //"highlight.js": "hljs",
        },
      },
    },
  },
});
