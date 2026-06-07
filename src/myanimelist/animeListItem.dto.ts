import type { Entries } from "type-fest";
import z from "zod";
import {
	animeSchema,
	animeStatusSchema,
	type AnimeStatus,
} from "../common/anime.model";

export const animeListItemStatusIdMap: Record<AnimeStatus, number> = {
	watching: 1,
	watched: 2,
	paused: 3,
	abandoned: 4,
	planned: 6,
};

export const animeListStatusIdToAnimeListStatus = z.codec(
	z.number(),
	animeStatusSchema,
	{
		encode: (status) => animeListItemStatusIdMap[status],
		decode(statusId) {
			const statusStatusIdEntries = Object.entries(
				animeListItemStatusIdMap,
			) as Entries<typeof animeListItemStatusIdMap>;

			const status = statusStatusIdEntries.find(
				([, id]) => id === statusId,
			)?.[0];

			if (status) {
				return status;
			}

			throw new Error("Unknown status");
		},
	},
);

export const animeListItemDtoSchema = z.object({
	anime_id: z.int().positive(),
	anime_score_val: z.number().min(0).max(10),
	anime_title_eng: z.string().nullable(),
	anime_title: z.string().nonempty(),
	status: z.int().positive(),
});
export type AnimeListItemDtoSchema = z.infer<typeof animeListItemDtoSchema>;

export const animeListItemDtoToAnime = z.codec(
	animeListItemDtoSchema,
	animeSchema,
	{
		encode: (value) => ({
			anime_id: value.id,
			anime_score_val: value.score,
			anime_title: value.title.native,
			anime_title_eng: value.title.english,
			status: animeListStatusIdToAnimeListStatus.encode(value.status),
		}),
		decode: (value) => ({
			id: value.anime_id,
			score: value.anime_score_val,
			status: animeListStatusIdToAnimeListStatus.decode(value.status),
			title: {
				native: value.anime_title,
				english: value.anime_title_eng === "" ? null : value.anime_title_eng,
			},
		}),
	},
);
