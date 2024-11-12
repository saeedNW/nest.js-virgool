import { ApiProperty } from "@nestjs/swagger";
import { AuthMessage } from "src/common/enums/messages.enum";

/**
 * Send OTP process unauthorized response
 */
export class SendOtpUnauthorized {
	@ApiProperty({
		description: "Response status code",
		example: 401,
	})
	statusCode: number;

	@ApiProperty({
		description: "Process result type",
		example: false,
	})
	success: boolean;

	@ApiProperty({
		description: "Response message",
		example: AuthMessage.InvalidData,
	})
	message: string;

	@ApiProperty({
		description: "Response timestamp",
		example: new Date(),
	})
	timestamp: Date;
}
