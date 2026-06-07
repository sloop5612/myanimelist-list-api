import { afterEach, describe, expect, it, vi } from "vitest";
import { createClient } from "./myAnimeList.client";

describe("createClient", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("fetchUserAnimeList", () => {
		it("returns empty array when table lacks data-items attribute", async () => {
			vi.spyOn(globalThis, "fetch").mockResolvedValue(
				new Response("<html><table></table></html>"),
			);
			const client = createClient();

			const result = await client.fetchUserAnimeList("testuser");

			expect(result).toEqual([]);
		});

		it("parses anime list from data-items attribute", async () => {
			const items = [
				{
					anime_id: 1,
					anime_score_val: 8.5,
					anime_title: "Naruto",
					anime_title_eng: "Naruto",
					status: 2,
				},
			];
			const html = `<html><table data-items='${JSON.stringify(items)}'></table></html>`;
			vi.spyOn(globalThis, "fetch").mockResolvedValue(
				new Response(html),
			);
			const client = createClient();

			const result = await client.fetchUserAnimeList("testuser");

			expect(result).toEqual([
				{
					id: 1,
					score: 8.5,
					status: "watched",
					title: { native: "Naruto", english: "Naruto" },
				},
			]);
		});

		it("parses anime with null english title", async () => {
			const items = [
				{
					anime_id: 2,
					anime_score_val: 0,
					anime_title: "Test",
					anime_title_eng: null,
					status: 4,
				},
			];
			const html = `<html><table data-items='${JSON.stringify(items)}'></table></html>`;
			vi.spyOn(globalThis, "fetch").mockResolvedValue(
				new Response(html),
			);
			const client = createClient();

			const result = await client.fetchUserAnimeList(
				"testuser",
				"abandoned",
			);

			expect(result).toEqual([
				{
					id: 2,
					score: 0,
					status: "abandoned",
					title: { native: "Test", english: null },
				},
			]);
		});
	});
});
