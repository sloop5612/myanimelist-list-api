import { load as loadHtml } from "cheerio";
import type { NonEmptyString } from "type-fest";
import { z } from "zod";
import type { Anime } from "../common/anime.model";
import {
	animeListStatusFilterIdToStatusFilter,
	type AnimeListStatusFilter,
} from "./animeList.model";
import { animeListItemDtoToAnime } from "./animeListItem.dto";

const baseUrl = new URL("https://myanimelist.net");

export function createClient() {
	return {
		async fetchUserAnimeList(
			username: NonEmptyString<string>,
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

function getAnimeListUrl(
	username: string,
	status: AnimeListStatusFilter = "all",
) {
	const statusId = animeListStatusFilterIdToStatusFilter.encode(status);
	return new URL(`/animelist/${username}?status=${statusId}`, baseUrl);
}
