import { isArray } from "class-validator";

/**
 * Converts a string or array of strings to an array of trimmed strings
 * @param {string[] | string | undefined} field - The input string, string array, or undefined
 * @returns {string[] | undefined} - An array of trimmed strings or undefined if input is falsy or invalid
 */
export function stringToArray(
	field: string[] | string | undefined
): string[] | undefined {
	/** Return undefined if the input is falsy (null, undefined, or empty) */
	if (!field || field === "") return undefined;

	/** Proceed if the input is string */
	if (typeof field === "string") {
		if (field.includes("#")) {
			/** Check if the string contains '#' character. Remove duplicated items */
			return [...new Set(field.split("#").map((item) => item.trim()))];
		} else if (field.includes(",")) {
			/** Check if the string contains ',' character. Remove duplicated items */
			return [...new Set(field.split(",").map((item) => item.trim()))];
		} else {
			/** If neither '#' nor ',' is found, create a single-item array. Remove duplicated items */
			return [...new Set(field.trim())];
		}
	}

	/** If the input is an array, ensure it's an array of strings and trim each item. Remove duplicated items */
	if (isArray(field)) {
		return [...new Set(field.map((item) => item.trim()))];
	}

	/** If input is neither string nor array, return undefined (invalid case) */
	return undefined;
}
