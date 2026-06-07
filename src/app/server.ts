import { Hono } from "hono";
import type { Anime } from "../common/anime.model";
import type { AnimeListStatusFilter } from "../myanimelist/animeList.model";
import { animeListStatusFilterSchema } from "../myanimelist/animeList.model";

export type AnimeListClient = {
	fetchUserAnimeList(username: string, status?: AnimeListStatusFilter): Promise<Anime[]>;
};

export function createRouter(client: AnimeListClient) {
	const app = new Hono();

	app.get("/user/:username/animelist", async (c) => {
		const username = c.req.param("username");

		try {
			const animeList = await client.fetchUserAnimeList(username);
			return c.json(animeList);
		} catch {
			return c.json({ error: "Failed to fetch anime list" }, 500);
		}
	});

	app.get("/user/:username/animelist/:status", async (c) => {
		const username = c.req.param("username");
		const status = c.req.param("status");

		const parsedStatus = animeListStatusFilterSchema.safeParse(status);
		if (!parsedStatus.success) {
			return c.json({ error: "Invalid status" }, 400);
		}

		try {
			const animeList = await client.fetchUserAnimeList(username, parsedStatus.data);
			return c.json(animeList);
		} catch {
			return c.json({ error: "Failed to fetch anime list" }, 500);
		}
	});

	return app;
}
