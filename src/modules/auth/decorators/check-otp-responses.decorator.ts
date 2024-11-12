import {
	ApiCreatedResponse,
	ApiInternalServerErrorResponse,
	ApiUnauthorizedResponse,
	ApiUnprocessableEntityResponse,
} from "@nestjs/swagger";
import { InternalServerErrorResponse } from "src/common/responses/internal-server-error-response";
import { UnauthorizedResponse } from "src/common/responses/unauthorized.response";
import { UnprocessableEntityResponse } from "src/common/responses/unprocessable.response";
import { CheckOtpSuccess } from "../responses/success.response";

/**
 * Custom decorator that combines multiple Swagger response decorators into a single, reusable decorator
 *
 * This decorator is designed to simplify the application of standard response types for the
 * `checkOTP` endpoint in the `AuthController`, making the controller code cleaner and easier to maintain
 *
 * When applied, it will document the following response types in Swagger:
 * - `201 Created`: Indicates a successful response
 * - `401 Unauthorized`: Indicates an authentication failure
 * - `422 Unprocessable Entity`: Represents validation errors in the request
 * - `500 Internal Server Error`: Indicates a server-side error
 */
export function ApiCheckOtpResponses() {
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
		 * Returns a `CheckOtpSuccess` response object to document the success state in Swagger.
		 */
		ApiCreatedResponse({
			description: "Success Response",
			type: CheckOtpSuccess,
		})(target, propertyKey, descriptor);

		/**
		 * Indicates an authentication error with status code 401.
		 * Returns a `UnauthorizedResponse` response object to document the unauthorized state in Swagger.
		 */
		ApiUnauthorizedResponse({
			description: "Unauthorized Response",
			type: UnauthorizedResponse,
		})(target, propertyKey, descriptor);

		/**
		 * Indicates a validation error with status code 422 when the request data cannot be processed.
		 * Returns a `UnprocessableEntityResponse` response object to document the unprocessable entity state in Swagger.
		 */
		ApiUnprocessableEntityResponse({
			description: "Unprocessable Entity Response",
			type: UnprocessableEntityResponse,
		})(target, propertyKey, descriptor);

		/**
		 * Indicates a server error with status code 500.
		 * Returns an `InternalServerErrorResponse` object to document the server error state in Swagger.
		 */
		ApiInternalServerErrorResponse({
			description: "Internal Server Error",
			type: InternalServerErrorResponse,
		})(target, propertyKey, descriptor);
	};
}
