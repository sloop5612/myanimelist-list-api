import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { animeListStatusFilterSchema } from "../myanimelist/animeList.model";
import { animeListSortSchema } from "../myanimelist/animeListSort.model";
import type { FetchUserAnimeListOptions } from "../myanimelist/myAnimeList.client";

export type AnimeListClient = {
	fetchUserAnimeList(username: string, options?: FetchUserAnimeListOptions): Promise<unknown[]>;
};

const route1QuerySchema = z.object({
	sort: animeListSortSchema.optional(),
});

const route2ParamsSchema = z.object({
	status: animeListStatusFilterSchema,
});

const route2QuerySchema = z.object({
	sort: animeListSortSchema.optional(),
});

export function createRouter(client: AnimeListClient) {
	const app = new Hono();

	app.get("/health", (c) => c.body(null, 204));

	app.get(
		"/user/:username/animelist",
		zValidator("query", route1QuerySchema, (result, c) => {
			if (!result.success) return c.json({ error: "Invalid sort" }, 400);
			return;
		}),
		async (c) => {
			const username = c.req.param("username");
			const { sort } = c.req.valid("query");

			try {
				const animeList = await client.fetchUserAnimeList(username, {
					status: "all",
					sort,
				});
				return c.json(animeList);
			} catch {
				return c.json({ error: "Failed to fetch anime list" }, 500);
			}
		},
	);

	app.get(
		"/user/:username/animelist/:status",
		zValidator("param", route2ParamsSchema, (result, c) => {
			if (!result.success) return c.json({ error: "Invalid status" }, 400);
			return;
		}),
		zValidator("query", route2QuerySchema, (result, c) => {
			if (!result.success) return c.json({ error: "Invalid sort" }, 400);
			return;
		}),
		async (c) => {
			const username = c.req.param("username");
			const { status } = c.req.valid("param");
			const { sort } = c.req.valid("query");

			try {
				const animeList = await client.fetchUserAnimeList(username, {
					status,
					sort,
				});
				return c.json(animeList);
			} catch {
				return c.json({ error: "Failed to fetch anime list" }, 500);
			}
		},
	);

	return app;
}
