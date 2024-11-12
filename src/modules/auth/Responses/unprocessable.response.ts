import { ApiProperty } from "@nestjs/swagger";
import { ValidationMessage } from "src/common/enums/messages.enum";

/**
 * Send OTP process unprocessable response
 */
export class SendOtpUnprocessable {
	@ApiProperty({
		description: "Response status code",
		example: 422,
	})
	statusCode: number;

	@ApiProperty({
		description: "Process result type",
		example: false,
	})
	success: boolean;

	@ApiProperty({
		description: "Response message",
		example: [ValidationMessage.InvalidEmail, ValidationMessage.UsernameLength],
	})
	message: [string];

	@ApiProperty({
		description: "Response timestamp",
		example: new Date(),
	})
	timestamp: Date;
}
