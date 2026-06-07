import { load as loadHtml } from "cheerio";
import { z } from "zod";
import type { Anime } from "../common/anime.model";
import {
	animeListStatusFilterIdToStatusFilter,
	type AnimeListStatusFilter,
} from "./animeList.model";
import { animeListItemDtoToAnime } from "./animeListItem.dto";
import { animeListSortToOrderIdMap, type AnimeListSort } from "./animeListSort.model";

export type FetchUserAnimeListOptions = {
	status?: AnimeListStatusFilter;
	sort?: AnimeListSort | undefined;
};

export function createClient() {
	return {
		async fetchUserAnimeList(
			username: string,
			options?: FetchUserAnimeListOptions,
		): Promise<Anime[]> {
			const status = options?.status ?? "all";
			const sort = options?.sort;
			const response = await fetch(getAnimeListUrl(username, status, sort));
			const html = await response.text();
			const $ = loadHtml(html);

			const dataItems = $("table[data-items]").attr("data-items");
			if (!dataItems) return [];

			return z.array(animeListItemDtoToAnime).parse(JSON.parse(dataItems));
		},
	};
}

function getAnimeListUrl(username: string, status: AnimeListStatusFilter, sort?: AnimeListSort) {
	const statusId = animeListStatusFilterIdToStatusFilter.encode(status);
	const params = new URLSearchParams({ status: String(statusId) });
	if (sort) {
		params.set("order", String(animeListSortToOrderIdMap[sort]));
	}
	return new URL(`/animelist/${username}?${params.toString()}`, "https://myanimelist.net");
}
