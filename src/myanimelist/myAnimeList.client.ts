import { load as loadHtml } from "cheerio";
import { z } from "zod";
import type { Anime } from "../common/anime.model";
import {
	animeListStatusFilterIdToStatusFilter,
	type AnimeListStatusFilter,
} from "./animeList.model";
import { animeListItemDtoToAnime } from "./animeListItem.dto";

export function createClient() {
	return {
		async fetchUserAnimeList(
			username: string,
			status: AnimeListStatusFilter = "all",
		): Promise<Anime[]> {
			const response = await fetch(getAnimeListUrl(username, status));
			const html = await response.text();
			const $ = loadHtml(html);

			const dataItems = $("table[data-items]").attr("data-items");
			if (!dataItems) return [];

			return z.array(animeListItemDtoToAnime).parse(JSON.parse(dataItems));
		},
	};
}

function getAnimeListUrl(username: string, status: AnimeListStatusFilter) {
	const statusId = animeListStatusFilterIdToStatusFilter.encode(status);
	return new URL(`/animelist/${username}?status=${statusId}`, "https://myanimelist.net");
}
