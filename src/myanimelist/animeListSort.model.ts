import { z } from "zod";

export const animeListSortSchema = z.enum(["score_desc", "start_date_asc"]);
export type AnimeListSort = z.infer<typeof animeListSortSchema>;

export const animeListSortToOrderIdMap: Record<AnimeListSort, number> = {
	score_desc: 17,
	start_date_asc: -3,
};
