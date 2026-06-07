import { describe, expect, it } from "vitest";
import { animeListSortSchema, animeListSortToOrderIdMap } from "./animeListSort.model";

describe("animeListSortSchema", () => {
	it("parses score_desc", () => {
		expect(animeListSortSchema.parse("score_desc")).toBe("score_desc");
	});

	it("parses start_date_asc", () => {
		expect(animeListSortSchema.parse("start_date_asc")).toBe("start_date_asc");
	});

	it("rejects invalid sort", () => {
		expect(() => animeListSortSchema.parse("invalid")).toThrow();
	});
});

describe("animeListSortToOrderIdMap", () => {
	it("contains correct order IDs", () => {
		expect(animeListSortToOrderIdMap).toEqual({
			score_desc: 17,
			start_date_asc: -3,
		});
	});
});
