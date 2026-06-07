import z from "zod";

export const nonEmptyStringOrNullSchema = z.codec(
	z.string().nullable(),
	z.string().nullable(),
	{
		encode: (v) => v,
		decode: (v) => v || null,
	},
);
