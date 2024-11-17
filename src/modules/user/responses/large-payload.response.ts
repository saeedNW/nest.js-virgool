import { ApiProperty } from "@nestjs/swagger";
import { FailureApiBaseResponse } from "src/common/abstracts/base.response";

/**
 * Too large payload error response (Uploaded file is too large)
 */
export class PayloadTooLargeResponse extends FailureApiBaseResponse {
	@ApiProperty({
		description: "Response status code",
		example: 413,
	})
	statusCode: number;
}
