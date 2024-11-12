import { ApiProperty } from "@nestjs/swagger";
import { FailureApiBaseResponse } from "src/common/responses/base.response";

/**
 * Send OTP process conflict response
 */
export class SendOtpConflict extends FailureApiBaseResponse {
	@ApiProperty({
		description: "Response status code",
		example: 409,
	})
	statusCode: number;
}
