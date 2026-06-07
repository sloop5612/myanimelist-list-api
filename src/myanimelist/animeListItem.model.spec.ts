import { describe, expect, it } from "vitest";
import { animeListStatusSchema } from "./animeListItem.model";

describe("animeListStatusSchema", () => {
	it.each(["watching", "watched", "paused", "abandoned", "planned", "all"])(
		"parses %s",
		(status) => {
			const result = animeListStatusSchema.parse(status);

			expect(result).toBe(status);
		},
	);

	it("rejects invalid status", () => {
		const input = "invalid";

		const act = () => animeListStatusSchema.parse(input);

		expect(act).toThrow();
	});
});
