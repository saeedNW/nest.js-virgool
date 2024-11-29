import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Put,
	Query,
} from "@nestjs/common";
import { BlogService } from "../services/blog.service";
import { CreateBlogDto } from "../dto/create-blog.dto";
import { plainToClass } from "class-transformer";
import { ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";
import { AuthDecorator } from "src/common/decorator/auth.decorator";
import { FindBlogsDto } from "../dto/filter.dto";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { SkipAuth } from "src/common/decorator/skip-auth.decorator";
import { UpdateBlogDto } from "../dto/update-blog.dto";
import { deleteInvalidPropertyInObject } from "src/common/utils/functions.utils";

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
	 * Blog bookmark process
	 */
	@Get("/by-slug/:slug")
	@SkipAuth()
	findOneBySlug(
		@Query() paginationDto: PaginationDto,
		@Param("slug") slug: string
	) {
		/** filter client pagination data and remove unwanted data */
		const filteredPaginationData = plainToClass(PaginationDto, paginationDto, {
			excludeExtraneousValues: true,
		});

		return this.blogService.findOneBySlug(slug, filteredPaginationData);
	}

	/**
	 * Blog removal process
	 */
	@Delete("/:id")
	delete(@Param("id", ParseIntPipe) id: number) {
		return this.blogService.delete(id);
	}

	/**
	 * Blog update process
	 */
	@Put("/:id")
	@ApiConsumes(SwaggerConsumes.URL_ENCODED, SwaggerConsumes.JSON)
	update(
		@Param("id", ParseIntPipe) id: number,
		@Body() updateBlogDto: UpdateBlogDto
	) {
		/** filter client data and remove unwanted data */
		const filteredData = plainToClass(UpdateBlogDto, updateBlogDto, {
			excludeExtraneousValues: true,
		});

		/** Remove invalid data */
		deleteInvalidPropertyInObject(filteredData);

		return this.blogService.update(id, filteredData);
	}

	/**
	 * Blog like process
	 */
	@Get("/like/:id")
	likeBlog(@Param("id", ParseIntPipe) id: number) {
		return this.blogService.likeBlog(id);
	}

	/**
	 * Blog bookmark process
	 */
	@Get("/bookmark/:id")
	bookmarkBlog(@Param("id", ParseIntPipe) id: number) {
		return this.blogService.bookmarkBlog(id);
	}
}
