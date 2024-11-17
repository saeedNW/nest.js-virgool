import { ApiProperty } from "@nestjs/swagger";
import { IsMobilePhone } from "class-validator";
import { ValidationMessage } from "src/common/enums/messages.enum";

/**
 * Create a dto for the process of updating user's phone number
 */
export class ChangePhoneDto {
	@ApiProperty()
	@IsMobilePhone("fa-IR", {}, { message: ValidationMessage.InvalidPhone })
	phone: string;
}
