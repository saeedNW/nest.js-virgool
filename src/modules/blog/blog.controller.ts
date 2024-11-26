import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from "@nestjs/common";
import { BlogService } from "./blog.service";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { plainToClass } from "class-transformer";
import { ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";
import { AuthDecorator } from "src/common/decorator/auth.decorator";
import { FindBlogsDto } from "./dto/filter.dto";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { SkipAuth } from "src/common/decorator/skip-auth.decorator";

@Controller("blog")
@ApiTags("Blogs")
@AuthDecorator()
export class BlogController {
	constructor(private readonly blogService: BlogService) {}

	/**
	 * New blog creation process
	 * @param createBlogDto - Blog data sent by user
	 */
	@Post("/")
	@ApiConsumes(SwaggerConsumes.URL_ENCODED, SwaggerConsumes.JSON)
	create(@Body() createBlogDto: CreateBlogDto) {
		/** filter client data and remove unwanted data */
		const filteredData = plainToClass(CreateBlogDto, createBlogDto, {
			excludeExtraneousValues: true,
		});

		return this.blogService.create(filteredData);
	}

	/**
	 * Retrieve user's blogs
	 */
	@Get("/mine")
	myBlogs() {
		return this.blogService.myBlogs();
	}

	/**
	 * Retrieve blogs list by filter and search
	 */
	@Get("/")
	@SkipAuth()
	@ApiOperation({ description: "Note: Authorization not needed" })
	find(
		@Query() paginationDto: PaginationDto,
		@Query() filterDto: FindBlogsDto
	) {
		/** filter client pagination data and remove unwanted data */
		const filteredPaginationData = plainToClass(PaginationDto, paginationDto, {
			excludeExtraneousValues: true,
		});

		/** filter client search data and remove unwanted data */
		const filteredSearchData = plainToClass(FindBlogsDto, filterDto, {
			excludeExtraneousValues: true,
		});

		return this.blogService.blogsList(
			filteredPaginationData,
			filteredSearchData
		);
	}

	/**
	 * Blog removal process
	 */
	@Delete("/:id")
	delete(@Param("id", ParseIntPipe) id: number) {
		return this.blogService.delete(id);
	}
}
