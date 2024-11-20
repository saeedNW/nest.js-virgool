import { Body, Controller, Post } from "@nestjs/common";
import { BlogService } from "./blog.service";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { plainToClass } from "class-transformer";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";
import { AuthDecorator } from "src/common/decorator/auth.decorator";

@Controller("blog")
@ApiTags("Blogs")
@AuthDecorator()
export class BlogController {
	constructor(private readonly blogService: BlogService) {}

	@Post("/")
	@ApiConsumes(SwaggerConsumes.URL_ENCODED, SwaggerConsumes.JSON)
	create(@Body() createBlogDto: CreateBlogDto) {
		/** filter client data and remove unwanted data */
		const filteredData = plainToClass(CreateBlogDto, createBlogDto, {
			excludeExtraneousValues: true,
		});

		return this.blogService.create(filteredData);
	}
}
