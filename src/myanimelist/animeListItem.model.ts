import z from "zod";
import { animeStatusSchema } from "../common/anime.model";

export const animeListStatusSchema = animeStatusSchema.or(z.enum(["all"]));
export type AnimeListStatus = z.infer<typeof animeListStatusSchema>;
