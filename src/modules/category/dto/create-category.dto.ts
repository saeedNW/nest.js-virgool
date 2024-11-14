import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsNumber, IsString, Length, Min } from "class-validator";
import { ValidationMessage } from "src/common/enums/messages.enum";

export class CreateCategoryDto {
	@ApiProperty()
	@IsString()
	@Length(3, 20, { message: ValidationMessage.CategoryTitleLength })
	@Expose()
	title: string;

	@ApiPropertyOptional()
	@Type(() => Number)
	@Min(1)
	@Expose()
	priority: number;
}
