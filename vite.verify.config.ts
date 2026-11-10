// Temporary local-verification config: same as vite.config.ts without the
// Netlify platform emulator (its bundled Deno CLI fails on this machine).
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	resolve: { tsconfigPaths: true },
	assetsInclude: ["**/*.glb"],
	plugins: [tailwindcss(), tanstackStart(), viteReact()],
});
