import {
	ApiBadRequestResponse,
	ApiConflictResponse,
	ApiInternalServerErrorResponse,
	ApiOkResponse,
	ApiUnauthorizedResponse,
	ApiUnprocessableEntityResponse,
} from "@nestjs/swagger";
import { InternalServerErrorResponse } from "src/common/responses/internal-server-error-response";
import { UnauthorizedResponse } from "src/common/responses/unauthorized.response";
import { ChangeEmailAndPhoneSuccess, ChangeUsernameSuccess } from "../responses/success.response";
import { UnprocessableEntityResponse } from "src/common/responses/unprocessable.response";
import { ConflictResponse } from "src/common/responses/conflict.response";
import { BadRequestResponse } from "src/common/responses/bad-request.response";

/**
 * Custom decorator that combines multiple Swagger response decorators into a single, reusable decorator
 */
export function ApiChangeUsernameResponses() {
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
			type: ChangeUsernameSuccess,
		})(target, propertyKey, descriptor);

		/**
		 * Indicates an authentication error with status code 401.
		 */
		ApiUnauthorizedResponse({
			description: "Unauthorized Response",
			type: UnauthorizedResponse,
		})(target, propertyKey, descriptor);

		/**
		 * Indicates a conflict error with status code 409.
		 */
		ApiConflictResponse({
			description: "Conflict Response",
			type: ConflictResponse,
		})(target, propertyKey, descriptor);

		/**
		 * Indicates a validation error with status code 422 when the request data cannot be processed.
		 */
		ApiUnprocessableEntityResponse({
			description: "Unprocessable Entity Response",
			type: UnprocessableEntityResponse,
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
