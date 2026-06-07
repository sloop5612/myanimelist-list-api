import { describe, expect, it } from "vitest";
import {
	animeDemographicSchema,
	animeGenreSchema,
	animeSchema,
} from "./anime.model";

describe("animeGenreSchema", () => {
	it("parses valid genre", () => {
		const result = animeGenreSchema.parse({ id: 1, name: "Action" });

		expect(result).toStrictEqual({ id: 1, name: "Action" });
	});

	it("rejects missing id", () => {
		const act = () => animeGenreSchema.parse({ name: "Action" });

		expect(act).toThrow();
	});

	it("rejects missing name", () => {
		const act = () => animeGenreSchema.parse({ id: 1 });

		expect(act).toThrow();
	});
});

describe("animeDemographicSchema", () => {
	it("parses valid demographic", () => {
		const result = animeDemographicSchema.parse({ id: 1, name: "Shounen" });

		expect(result).toStrictEqual({ id: 1, name: "Shounen" });
	});

	it("rejects missing id", () => {
		const act = () => animeDemographicSchema.parse({ name: "Shounen" });

		expect(act).toThrow();
	});

	it("rejects missing name", () => {
		const act = () => animeDemographicSchema.parse({ id: 1 });

		expect(act).toThrow();
	});
});

describe("animeSchema", () => {
	it("parses valid anime", () => {
		const result = animeSchema.parse({
			id: 1,
			status: "watching",
			score: 8.5,
			title: { native: "Naruto", english: "Naruto English" },
		});

		expect(result).toStrictEqual({
			id: 1,
			status: "watching",
			score: 8.5,
			title: { native: "Naruto", english: "Naruto English" },
		});
	});

	it("rejects non-positive id", () => {
		const act = () =>
			animeSchema.parse({
				id: 0,
				status: "watching",
				score: 8.5,
				title: { native: "Naruto", english: null },
			});

		expect(act).toThrow();
	});

	it("rejects invalid status", () => {
		const act = () =>
			animeSchema.parse({
				id: 1,
				status: "invalid",
				score: 8.5,
				title: { native: "Naruto", english: null },
			});

		expect(act).toThrow();
	});

	it("rejects empty native title", () => {
		const act = () =>
			animeSchema.parse({
				id: 1,
				status: "watching",
				score: 8.5,
				title: { native: "", english: null },
			});

		expect(act).toThrow();
	});
});
