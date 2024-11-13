import { ApiProperty } from "@nestjs/swagger";
import { CreateApiBaseResponse } from "src/common/abstracts/base.response";

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

/**
 * Check OTP process success response
 */
export class CheckOtpSuccess extends CreateApiBaseResponse {
	@ApiProperty({
		description: "Response data (Development Environment Only)",
		example: { token: "JWT Token" },
	})
	data: { accessToken: string };
}
