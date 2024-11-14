import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsNumber, IsString, Length, Min } from "class-validator";
import { ValidationMessage } from "src/common/enums/messages.enum";

export class CreateCategoryDto {
	@ApiProperty()
	@IsString()
	@Length(3, 20, { message: ValidationMessage.CategoryTitleLength })
	@Expose()
	title: string;

	@ApiPropertyOptional()
	@Expose()
	priority: number;
}
