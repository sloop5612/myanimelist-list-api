import { serve } from "@hono/node-server";
import { createRouter } from "./app/server";
import { createClient } from "./myanimelist/myAnimeList.client";

const app = createRouter(createClient());

serve(app, (info) => {
	console.log(`Listening on http://localhost:${info.port}`);
});
