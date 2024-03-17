import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
    assetsInclude: ["/sb-preview/runtime.js"],
    plugins: [solid()],
});
