import { ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class PaginationDto {
	@ApiPropertyOptional({ type: "integer", example: 1 })
	@Expose()
	page: number;

	@ApiPropertyOptional({ type: "integer", example: 10 })
	@Expose()
	limit: number;
}
