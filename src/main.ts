import { serve } from "@hono/node-server";
import { createRouter } from "./app/server";
import { createClient } from "./myanimelist/myAnimeList.client";

const app = createRouter(createClient());
const port = Number(process.env["PORT"] ?? 3000);

serve({ fetch: app.fetch, port }, (info) => {
	console.log(`Listening on http://localhost:${info.port}`);
});
