import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumberString, Length } from "class-validator";
import { stringToArray } from "src/common/utils/string-to-array";

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

	@ApiProperty({ type: String, isArray: true, description: "category id" })
	@Transform((params) =>
		!params.value ? undefined : stringToArray(params.value)
	)
	@IsArray()
	@Expose()
	categories: string[] | string;
}
