import { ApiProperty } from "@nestjs/swagger";
import { FailureApiBaseResponse } from "src/common/responses/base.response";

/**
 * Send OTP process unprocessable response
 */
export class SendOtpUnprocessable extends FailureApiBaseResponse {
	@ApiProperty({
		description: "Response status code",
		example: 422,
	})
	statusCode: number;

	@ApiProperty({
		description: "Response message",
		example: ["Validation Error #1", "Validation Error #2"],
	})
	override message: [string];
}
