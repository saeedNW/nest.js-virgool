import { ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class FindBlogsDto {
	@ApiPropertyOptional()
	@Expose()
	search: string;
}
