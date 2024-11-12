import { ApiProperty } from "@nestjs/swagger";
import { BadRequestMessage } from "src/common/enums/messages.enum";

/**
 * Send OTP process bad request response
 */
export class SendOtpBadRequest {
	@ApiProperty({
		description: "Response status code",
		example: 400,
	})
	statusCode: number;

	@ApiProperty({
		description: "Process result type",
		example: false,
	})
	success: boolean;

	@ApiProperty({
		description: "Response message",
		example: BadRequestMessage.InvalidRegisterMethod,
	})
	message: string;

	@ApiProperty({
		description: "Response timestamp",
		example: new Date(),
	})
	timestamp: Date;
}
