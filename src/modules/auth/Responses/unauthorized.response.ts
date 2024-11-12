import { ApiProperty } from "@nestjs/swagger";
import { FailureApiBaseResponse } from "src/common/responses/base.response";

/**
 * Send OTP process unauthorized response
 */
export class SendOtpUnauthorized extends FailureApiBaseResponse {
	@ApiProperty({
		description: "Response status code",
		example: 401,
	})
	statusCode: number;
}
