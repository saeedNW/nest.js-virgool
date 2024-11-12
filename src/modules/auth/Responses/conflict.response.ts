import { ApiProperty } from "@nestjs/swagger";
import { AuthMessage } from "src/common/enums/messages.enum";

/**
 * Send OTP process conflict response
 */
export class SendOtpConflict {
	@ApiProperty({
		description: "Response status code",
		example: 409,
	})
	statusCode: number;

	@ApiProperty({
		description: "Process result type",
		example: false,
	})
	success: boolean;

	@ApiProperty({
		description: "Response message",
		example: AuthMessage.DuplicatedEntry,
	})
	message: string;

	@ApiProperty({
		description: "Response timestamp",
		example: new Date(),
	})
	timestamp: Date;
}
