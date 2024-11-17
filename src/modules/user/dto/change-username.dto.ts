import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class ChangeUsernameDto {
	@ApiProperty()
	@IsString()
	@Length(3, 100)
	username: string;
}
