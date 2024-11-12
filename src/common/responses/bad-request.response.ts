import { ApiProperty } from "@nestjs/swagger";
import { FailureApiBaseResponse } from "src/common/responses/base.response";

/**
 * API process bad request swagger response
 */
export class BadRequestResponse extends FailureApiBaseResponse {
	@ApiProperty({
		description: "Response status code",
		example: 400,
	})
	statusCode: number;
}
