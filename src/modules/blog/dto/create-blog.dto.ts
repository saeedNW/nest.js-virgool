import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNotEmpty, IsNumberString, Length } from "class-validator";

export class CreateBlogDto {
	@ApiProperty()
	@IsNotEmpty()
	@Length(10, 150)
	@Expose()
	title: string;
	@ApiPropertyOptional()
	@Expose()
	image: string;
	@ApiProperty()
	@IsNotEmpty()
	@Length(10, 300)
	@Expose()
	description: string;
	@ApiProperty()
	@IsNotEmpty()
	@Length(100)
	@Expose()
	content: string;
	@ApiPropertyOptional()
	@Expose()
	slug: string;
	@ApiProperty()
	@IsNotEmpty()
	@IsNumberString()
	@Expose()
	time_for_study: string;

	// @ApiProperty({ type: String, isArray: true })
	// // @IsArray()
	// categories: string[] | string;
}
