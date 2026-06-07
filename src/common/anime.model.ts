import { z } from "zod";
import { nonEmptyStringOrNullSchema } from "./string";

export const animeStatusSchema = z.enum([
	"abandoned",
	"paused",
	"planned",
	"watched",
	"watching",
]);
export type AnimeStatus = z.infer<typeof animeStatusSchema>;

export const animeGenreSchema = z.object({
	id: z.number(),
	name: z.string(),
});
export type AnimeGenre = z.infer<typeof animeGenreSchema>;

export const animeDemographicSchema = z.object({
	id: z.number(),
	name: z.string(),
});
export type AnimeDemographic = z.infer<typeof animeDemographicSchema>;

export const animeSchema = z.object({
	id: z.number().int().positive(),
	status: animeStatusSchema,
	score: z.number(),
	title: z.object({
		native: z.string().nonempty(),
		english: nonEmptyStringOrNullSchema,
	}),
});
export type Anime = z.infer<typeof animeSchema>;
