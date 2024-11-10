import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { AuthType } from "../enums/type.enum";
import { IsEnum, IsString, Length } from "class-validator";
import { AuthMethod } from "../enums/method.enum";
import { ValidationMessage } from "src/common/enums/messages.enum";

/**
 * User authentication process DTO
 */
export class AuthDto {
	@ApiProperty() //? Make the field accessible in swagger ui
	@IsString()
	@Length(3, 60, { message: ValidationMessage.UsernameLength })
	@Expose()
	username: string;
	/**
	 * Username should be an string with the length of 3 to 30 characters
	 */

	@ApiProperty({ enum: AuthType }) //? Make the field accessible in swagger ui
	@IsEnum(AuthType, { message: ValidationMessage.InvalidAuthType })
	@Expose()
	type: AuthType;
	/**
	 * The authentication type specifies whether the user is trying to log in or register.
	 * It should be a string of predefined enums [login, register]
	 */

	@ApiProperty({ enum: AuthMethod }) //? Make the field accessible in swagger ui
	@IsEnum(AuthMethod, { message: ValidationMessage.InvalidAuthMethod })
	@Expose()
	method: AuthMethod;
	/**
	 * The authentication method define which option is user using in order to login
	 * or register into the system. It should be a string of predefined enums
	 * [username, email, phone]
	 */
}
