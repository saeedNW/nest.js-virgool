import { ApiProperty } from "@nestjs/swagger";
import { SuccessMessage } from "src/common/enums/messages.enum";

/**
 * Send OTP process success response
 */
export class SendOtpSuccess {
	@ApiProperty({
		description: "Response status code",
		example: 201,
	})
	statusCode: number;

	@ApiProperty({
		description: "Process result type",
		example: true,
	})
	success: boolean;

	@ApiProperty({
		description: "Response message",
		example: SuccessMessage.SendOTP,
	})
	message: string;

	@ApiProperty({
		description: "Response data (Development Environment Only)",
		example: { code: "78363", token: "JWT Token" },
	})
	data: { code: string; token: string };
}
