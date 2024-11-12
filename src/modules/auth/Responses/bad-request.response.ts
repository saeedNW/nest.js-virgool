import { ApiProperty } from "@nestjs/swagger";
import { FailureApiBaseResponse } from "src/common/responses/base.response";

/**
 * Send OTP process bad request response
 */
export class SendOtpBadRequest extends FailureApiBaseResponse {
	@ApiProperty({
		description: "Response status code",
		example: 400,
	})
	statusCode: number;
}
