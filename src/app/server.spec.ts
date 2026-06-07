import { describe, it, expect, vi } from "vitest";
import type { Anime } from "../common/anime.model";
import { createRouter } from "./server";

const mockAnime: Anime = {
	id: 1,
	status: "watching",
	score: 8,
	title: { native: "Test Anime", english: null },
};

describe("GET /user/:username/animelist", () => {
	it("returns 200 with anime list", async () => {
		const fetchUserAnimeList = vi.fn().mockResolvedValue([mockAnime]);
		const router = createRouter({ fetchUserAnimeList });

		const res = await router.request("/user/testuser/animelist");

		expect(res.status).toBe(200);
		expect(await res.json()).toEqual([mockAnime]);
		expect(fetchUserAnimeList).toHaveBeenCalledWith("testuser");
	});

	it("returns 500 when client throws", async () => {
		const fetchUserAnimeList = vi.fn().mockRejectedValue(new Error("fail"));
		const router = createRouter({ fetchUserAnimeList });

		const res = await router.request("/user/testuser/animelist");

		expect(res.status).toBe(500);
		expect(await res.json()).toEqual({ error: "Failed to fetch anime list" });
	});
});

describe("GET /user/:username/animelist/:status", () => {
	it("returns 200 with filtered list for valid status", async () => {
		const fetchUserAnimeList = vi.fn().mockResolvedValue([mockAnime]);
		const router = createRouter({ fetchUserAnimeList });

		const res = await router.request("/user/testuser/animelist/watching");

		expect(res.status).toBe(200);
		expect(await res.json()).toEqual([mockAnime]);
		expect(fetchUserAnimeList).toHaveBeenCalledWith("testuser", "watching");
	});

	it("returns 400 for invalid status", async () => {
		const fetchUserAnimeList = vi.fn();
		const router = createRouter({ fetchUserAnimeList });

		const res = await router.request("/user/testuser/animelist/invalid");

		expect(res.status).toBe(400);
		expect(await res.json()).toEqual({ error: "Invalid status" });
		expect(fetchUserAnimeList).not.toHaveBeenCalled();
	});

	it("returns 500 when client throws", async () => {
		const fetchUserAnimeList = vi.fn().mockRejectedValue(new Error("fail"));
		const router = createRouter({ fetchUserAnimeList });

		const res = await router.request("/user/testuser/animelist/watching");

		expect(res.status).toBe(500);
		expect(await res.json()).toEqual({ error: "Failed to fetch anime list" });
	});
});
