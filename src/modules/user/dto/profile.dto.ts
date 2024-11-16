import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, Length } from "class-validator";
import { Gender } from "../enums/gender.enum";
import { Expose } from "class-transformer";

export class ProfileDto {
	@ApiPropertyOptional()
	@IsOptional()
	@Length(3, 100)
	@Expose()
	nickname: string;

	@ApiPropertyOptional({ nullable: true })
	@IsOptional()
	@Length(10, 200)
	@Expose()
	bio: string;

	@ApiPropertyOptional({ nullable: true, format: "binary" })
	profile_image: string;

	@ApiPropertyOptional({ nullable: true, format: "binary" })
	profile_bg_image: string;

	@ApiPropertyOptional({ nullable: true, enum: Gender })
	@IsOptional()
	@IsEnum(Gender)
	@Expose()
	gender: string;

	@ApiPropertyOptional({ nullable: true, example: "1996-02-22T12:01:26.487Z" })
	@Expose()
	birthday: Date;

	@ApiPropertyOptional({ nullable: true })
	@Expose()
	linkedin_profile: string;
}
