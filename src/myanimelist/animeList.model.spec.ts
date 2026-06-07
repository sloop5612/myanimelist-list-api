import { describe, expect, it } from "vitest";
import {
	animeListStatusFilterIdToStatusFilter,
	animeListStatusFilterSchema,
	animeListStatusFilterToIdMap,
	type AnimeListStatusFilter,
} from "./animeList.model";

describe("animeListStatusFilterSchema", () => {
	it.each(["watching", "watched", "paused", "abandoned", "planned", "all"])(
		"parses %s",
		(status) => {
			const result = animeListStatusFilterSchema.parse(status);

			expect(result).toBe(status);
		},
	);

	it("rejects invalid status", () => {
		const input = "invalid";

		const act = () => animeListStatusFilterSchema.parse(input);

		expect(act).toThrow();
	});
});

describe("animeListStatusFilterToIdMap", () => {
	it("contains all statuses with correct IDs", () => {
		expect(animeListStatusFilterToIdMap).toStrictEqual({
			watching: 1,
			watched: 2,
			paused: 3,
			abandoned: 4,
			planned: 6,
			all: 7,
		});
	});
});

describe("animeListStatusFilterIdToStatusFilter", () => {
	describe("encode", () => {
		it.each<[AnimeListStatusFilter, number]>([
			["watching", 1],
			["watched", 2],
			["paused", 3],
			["abandoned", 4],
			["planned", 6],
			["all", 7],
		])("encodes %s as %i", (status, expected) => {
			const result = animeListStatusFilterIdToStatusFilter.encode(status);

			expect(result).toBe(expected);
		});
	});

	describe("decode", () => {
		it.each([
			[1, "watching"],
			[2, "watched"],
			[3, "paused"],
			[4, "abandoned"],
			[6, "planned"],
			[7, "all"],
		])("decodes %i as %s", (id, expected) => {
			const result = animeListStatusFilterIdToStatusFilter.parse(id);

			expect(result).toBe(expected);
		});

		it("throws for unknown id", () => {
			const input = 99;

			const act = () => animeListStatusFilterIdToStatusFilter.parse(input);

			expect(act).toThrow("Unknown status");
		});
	});
});
