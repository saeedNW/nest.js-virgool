import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import {  IsString, Length } from "class-validator";
import { ValidationMessage } from "src/common/enums/messages.enum";

/**
 * Client Check OTP process validator
 */
export class CheckOtpDto {
	@ApiProperty()
	@IsString()
	@Length(5, 5, { message: ValidationMessage.OTPLength })
	@Expose()
	code: string;
}
