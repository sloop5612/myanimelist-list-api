import { describe, expect, it } from "vitest";
import { z } from "zod";
import { animeListItemDtoToAnime, animeListStatusIdToAnimeListStatus } from "./animeListItem.dto";

describe("animeStatusIdToStatusCodec", () => {
	describe("decode (number → status)", () => {
		it.each([
			[1, "watching"],
			[2, "watched"],
			[3, "paused"],
			[4, "abandoned"],
			[6, "planned"],
		])("parses %i as %s", (id, expected) => {
			const result = animeListStatusIdToAnimeListStatus.parse(id);

			expect(result).toBe(expected);
		});

		it("throws for unknown status id 5", () => {
			const input = 5;

			const act = () => animeListStatusIdToAnimeListStatus.parse(input);

			expect(act).toThrow("Unknown status");
		});

		it("throws for unknown status id 99", () => {
			const input = 99;

			const act = () => animeListStatusIdToAnimeListStatus.parse(input);

			expect(act).toThrow("Unknown status");
		});

		it("throws for non-number input", () => {
			const input = "watching";

			const act = () => animeListStatusIdToAnimeListStatus.parse(input);

			expect(act).toThrow();
		});
	});

	describe("encode (status → number)", () => {
		const encodeCodec = z.invertCodec(animeListStatusIdToAnimeListStatus);

		it.each([
			["watching", 1],
			["watched", 2],
			["paused", 3],
			["abandoned", 4],
			["planned", 6],
		])("encodes %s as %i", (status, expected) => {
			const result = encodeCodec.parse(status);

			expect(result).toBe(expected);
		});

		it("throws for invalid status string", () => {
			const input = "invalid";

			const act = () => encodeCodec.parse(input);

			expect(act).toThrow();
		});
	});
});

describe("animeListItemDtoToAnime", () => {
	describe("decode (DTO → Anime)", () => {
		it("parses DTO with default fields", () => {
			const dto = {
				anime_id: 1,
				anime_score_val: 8.5,
				anime_title: "Naruto",
				anime_title_eng: "Naruto English",
				status: 2,
			};

			const result = animeListItemDtoToAnime.parse(dto);

			expect(result).toStrictEqual({
				id: 1,
				score: 8.5,
				status: "watched",
				title: { native: "Naruto", english: "Naruto English" },
			});
		});

		it("converts empty english title to null", () => {
			const dto = {
				anime_id: 2,
				anime_score_val: 0,
				anime_title: "Test",
				anime_title_eng: "",
				status: 4,
			};

			const result = animeListItemDtoToAnime.parse(dto);

			expect(result).toStrictEqual({
				id: 2,
				score: 0,
				status: "abandoned",
				title: { native: "Test", english: null },
			});
		});

		it("parses DTO with null english title", () => {
			const dto = {
				anime_id: 3,
				anime_score_val: 6,
				anime_title: "Foo",
				anime_title_eng: null,
				status: 6,
			};

			const result = animeListItemDtoToAnime.parse(dto);

			expect(result).toStrictEqual({
				id: 3,
				score: 6,
				status: "planned",
				title: { native: "Foo", english: null },
			});
		});
	});

	describe("encode (Anime → DTO)", () => {
		it("encodes a full anime object with english title", () => {
			const anime = {
				id: 1,
				score: 8.5,
				status: "watched" as const,
				title: { native: "Naruto", english: "Naruto English" },
			};

			const result = animeListItemDtoToAnime.encode(anime);

			expect(result).toStrictEqual({
				anime_id: 1,
				anime_score_val: 8.5,
				anime_title: "Naruto",
				anime_title_eng: "Naruto English",
				status: 2,
			});
		});

		it("encodes anime with null english title", () => {
			const anime = {
				id: 2,
				score: 0,
				status: "abandoned" as const,
				title: { native: "Test", english: null },
			};

			const result = animeListItemDtoToAnime.encode(anime);

			expect(result).toStrictEqual({
				anime_id: 2,
				anime_score_val: 0,
				anime_title: "Test",
				anime_title_eng: null,
				status: 4,
			});
		});
	});
});
