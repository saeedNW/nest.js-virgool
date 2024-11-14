import {
	ApiInternalServerErrorResponse,
	ApiOkResponse,
	ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { InternalServerErrorResponse } from "src/common/responses/internal-server-error-response";
import { UnauthorizedResponse } from "src/common/responses/unauthorized.response";
import { FindAllCategoriesSuccess } from "../responses/success.response";

/**
 * Custom decorator that combines multiple Swagger response decorators into a single, reusable decorator
 */
export function ApiFindAllCategoriesResponses() {
	/**
	 * Return a function that registers the decorator
	 * @param {any} target - The target where this decorator is used on
	 * @param {string} propertyKey - The name of the target method or class
	 * @param {PropertyDescriptor} descriptor - The property descriptor for the method, which provides metadata about the method
	 * 											and allows the decorator to modify the method's behavior if needed.
	 */
	return function (
		target: any,
		propertyKey: string,
		descriptor: PropertyDescriptor
	) {
		/**
		 * Indicates a successful response with status code 201.
		 */
		ApiOkResponse({
			description: "Success Response",
			type: FindAllCategoriesSuccess,
		})(target, propertyKey, descriptor);

		/**
		 * Indicates an authentication error with status code 401.
		 */
		ApiUnauthorizedResponse({
			description: "Unauthorized Response",
			type: UnauthorizedResponse,
		})(target, propertyKey, descriptor);

		/**
		 * Indicates a server error with status code 500.
		 */
		ApiInternalServerErrorResponse({
			description: "Internal Server Error",
			type: InternalServerErrorResponse,
		})(target, propertyKey, descriptor);
	};
}
