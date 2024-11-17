import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";
import { ValidationMessage } from "src/common/enums/messages.enum";

/**
 * Create a dto for the process of updating user's email address
 */
export class ChangeEmailDto {
	@ApiProperty()
	@IsEmail({}, { message: ValidationMessage.InvalidEmail })
	email: string;
}
