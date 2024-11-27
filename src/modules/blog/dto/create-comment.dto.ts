import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { IsNumber, IsOptional, Length } from "class-validator";

export class CreateCommentDto {
	@ApiProperty()
	@Length(5)
	@Expose()
	text: string;

	@ApiProperty()
	@Transform((param) => parseInt(param.value))
	@IsNumber()
	@Expose()
	blogId: number;

	@ApiPropertyOptional()
	@Transform((params) =>
		!params.value || isNaN(parseInt(params.value))
			? undefined
			: parseInt(params.value)
	)
	@IsOptional()
	@IsNumber()
	@Expose()
	parentId: number;
}
