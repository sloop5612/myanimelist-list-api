import { describe, expect, it } from "vitest";
import { nonEmptyStringOrNullSchema } from "./string";

describe("nonEmptyStringOrNullSchema", () => {
	it("passes through non-empty string", () => {
		const input = "hello";

		const result = nonEmptyStringOrNullSchema.parse(input);

		expect(result).toBe("hello");
	});

	it("passes through null", () => {
		const input = null;

		const result = nonEmptyStringOrNullSchema.parse(input);

		expect(result).toBeNull();
	});

	it("accepts empty string", () => {
		const input = "";

		const result = nonEmptyStringOrNullSchema.parse(input);

		expect(result).toBe(null);
	});

	describe("encode", () => {
		it("encodes non-empty string", () => {
			const input = "hello";

			const result = nonEmptyStringOrNullSchema.encode(input);

			expect(result).toBe("hello");
		});

		it("encodes null", () => {
			const input = null;

			const result = nonEmptyStringOrNullSchema.encode(input);

			expect(result).toBeNull();
		});

		it("encodes empty string", () => {
			const input = "";

			const result = nonEmptyStringOrNullSchema.encode(input);

			expect(result).toBe("");
		});
	});
});
