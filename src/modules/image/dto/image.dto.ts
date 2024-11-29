import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class ImageDto {
	@ApiProperty({ format: "binary" })
	image: string;

	@ApiProperty()
	@Expose()
	name: string;

	@ApiPropertyOptional()
	@Expose()
	alt: string;
}
