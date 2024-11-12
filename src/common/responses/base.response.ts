import { ApiProperty } from "@nestjs/swagger";

/**
 * A base response type class for FAILURE responses to be used in order to make
 * the subclasses code cleaner and easier to maintain
 */
export class FailureApiBaseResponse {
	@ApiProperty({
		description: "Response message",
		example: "Process error message",
	})
	message: any;
	/**
	 * Typically, the `message` property is a single string. However, for validation errors,
	 * it may be an array of strings to capture multiple validation messages.
	 *
	 * To prevent type conflicts, the type of `message` in the base response class has been set to `any`.
	 *
	 * In validation-related subclasses, be sure to redeclare the `message` property using the `override`
	 * keyword to specify the expected type, such as `[string]`.
	 */

	@ApiProperty({
		description: "Response timestamp",
		example: new Date(),
	})
	timestamp: Date;

	@ApiProperty({
		description: "Process result type",
		example: false,
	})
	success: boolean;
}

/**
 * A base response type class for OK responses to be used in order to make
 * the subclasses code cleaner and easier to maintain
 */
export class OkApiBaseResponse {
	@ApiProperty({
		description: "Response status code",
		example: 200,
	})
	statusCode: number;

	@ApiProperty({
		description: "Process result type",
		example: true,
	})
	success: boolean;

	@ApiProperty({
		description: "Response message",
		example: "Process success message",
	})
	message: string;
}

/**
 * A base response type class for CREATION responses to be used in order to make
 * the subclasses code cleaner and easier to maintain
 *
 * This class is a subclasses from `ApiBaseOkResponse` with only status code 
 * being override
 */
export class CreateApiBaseResponse extends OkApiBaseResponse {
	@ApiProperty({
		description: "Response status code",
		example: 201,
	})
	override statusCode: number;
}
