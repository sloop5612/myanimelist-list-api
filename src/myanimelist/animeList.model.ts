import type { Entries } from "type-fest";
import { z } from "zod";
import { animeStatusSchema } from "../common/anime.model";
import { animeListItemStatusIdMap } from "./animeListItem.dto";

export const animeListStatusFilterSchema = animeStatusSchema.or(z.enum(["all"]));
export type AnimeListStatusFilter = z.infer<typeof animeListStatusFilterSchema>;

export const animeListStatusFilterToIdMap: Record<AnimeListStatusFilter, number> = {
	...animeListItemStatusIdMap,
	all: 7,
};

export const animeListStatusFilterIdToStatusFilter = z.codec(
	z.number(),
	animeListStatusFilterSchema,
	{
		encode: (status) => animeListStatusFilterToIdMap[status],
		decode(statusId) {
			const statusStatusIdEntries = Object.entries(animeListStatusFilterToIdMap) as Entries<
				typeof animeListStatusFilterToIdMap
			>;

			const status = statusStatusIdEntries.find(([, id]) => id === statusId)?.[0];

			if (status) {
				return status;
			}

			throw new Error("Unknown status");
		},
	},
);
