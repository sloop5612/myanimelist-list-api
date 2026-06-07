import { defineConfig } from "vitest/config";

export default defineConfig({
	appType: "custom",
	build: {
		target: "node24",
		lib: {
			entry: "src/main.ts",
			formats: ["es"],
		},
		rollupOptions: {
			external: (id: string) => !id.startsWith(".") && !id.startsWith("/"),
		},
	},
	test: {
		coverage: {
			enabled: true,
			include: ["src/**/*.ts"],
			exclude: [".stryker-tmp/**", "src/main.ts"],
			thresholds: {
				100: true,
			},
		},
	},
});
