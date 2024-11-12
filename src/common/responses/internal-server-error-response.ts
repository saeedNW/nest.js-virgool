import { ApiProperty } from "@nestjs/swagger";
import { FailureApiBaseResponse } from "src/common/responses/base.response";

/**
 * Internal server error response
 */
export class InternalServerErrorResponse extends FailureApiBaseResponse {
	@ApiProperty({
		description: "Response status code",
		example: 500,
	})
	statusCode: number;
}
