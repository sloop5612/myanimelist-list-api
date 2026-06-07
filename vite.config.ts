import { defineConfig } from "vitest/config";

export default defineConfig({
	appType: "custom",
	build: {
		lib: {
			entry: "src/main.ts",
			formats: ["es"],
		},
	},
	test: {
		coverage: {
			enabled: true,
			include: ["src/**/*.ts"],
			exclude: [".stryker-tmp/**"],
			thresholds: {
				100: true,
			},
		},
	},
});
