import { ApiProperty } from "@nestjs/swagger";
import { CreateApiBaseResponse } from "src/common/responses/base.response";

/**
 * Send OTP process success response
 */
export class SendOtpSuccess extends CreateApiBaseResponse {
	@ApiProperty({
		description: "Response data (Development Environment Only)",
		example: { code: "78363", token: "JWT Token" },
	})
	data: { code: string; token: string };
}
