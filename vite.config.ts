import netlify from "@netlify/vite-plugin-tanstack-start";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { createLogger, defineConfig, type Plugin } from "vite";

const isAbortLike = (value: unknown): boolean => {
	if (value && typeof value === "object") {
		const error = value as {
			name?: string;
			message?: string;
			code?: string;
			cause?: unknown;
		};
		return (
			error.name === "AbortError" ||
			error.code === "ECONNRESET" ||
			error.message === "aborted" ||
			isAbortLike(error.message) ||
			isAbortLike(error.cause)
		);
	}
	return (
		typeof value === "string" &&
		/aborted|ECONNRESET|abortIncoming/i.test(value)
	);
};

const isIgnorableAbortError = (
	msg: unknown,
	options?: Record<string, unknown>,
): boolean => {
	const str = `${msg} ${
		options?.error
			? (options.error as Error).stack || (options.error as Error).message
			: ""
	}`;
	return (
		(/AbortError/.test(str) && /This operation was aborted/.test(str)) ||
		/aborted/i.test(str) ||
		/ECONNRESET/i.test(str) ||
		/abortIncoming/i.test(str)
	);
};

const baseLogger = createLogger("info");
const customLogger = {
	...baseLogger,
	error: (msg: string, options?: Record<string, unknown>) => {
		if (isIgnorableAbortError(msg, options)) return;
		baseLogger.error(msg, options);
	},
};

/**
 * TanStack Start logs aborted SSR requests (browser reloads during HMR) with
 * `console.error`, which bypasses Vite's custom logger. They are harmless, so
 * filter them out in development only.
 */
const silenceAbortedRequestLogs = (): Plugin => ({
	name: "vertsan:silence-aborted-request-logs",
	apply: "serve",
	configureServer() {
		const marked = console.error as typeof console.error & {
			__vertsanAbortFilter?: boolean;
		};
		if (marked.__vertsanAbortFilter) return;
		const original = console.error.bind(console);
		const filtered = (...args: unknown[]) => {
			if (args.some(isAbortLike)) return;
			original(...args);
		};
		(filtered as typeof filtered & { __vertsanAbortFilter?: boolean })
			.__vertsanAbortFilter = true;
		console.error = filtered;
	},
});

const config = defineConfig({
	resolve: { tsconfigPaths: true },
	assetsInclude: ["**/*.glb"],
	customLogger,
	ssr: { noExternal: ["gsap"] },
	server: {
		watch: {
			ignored: (path) =>
				/[\\/]public[\\/][\w\-. ]+ \(\d+\)\.[\w]+$/i.test(path),
		},
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (!id.includes("node_modules")) return;
					if (
						id.includes("framer-motion") ||
						id.includes("/node_modules/motion/")
					) {
						return "motion";
					}
					if (id.includes("/node_modules/gsap/")) return "gsap";
					if (
						id.includes("@react-three/") ||
						id.includes("/node_modules/three/") ||
						id.includes("/node_modules/meshline/")
					) {
						return "three";
					}
					if (id.includes("/node_modules/recharts/")) return "charts";
				},
			},
		},
	},
	plugins: [
		silenceAbortedRequestLogs(),
		devtools({ removeDevtoolsOnBuild: true }),
		netlify(),
		tailwindcss(),
		tanstackStart(),
		viteReact(),
	],
});

export default config;
