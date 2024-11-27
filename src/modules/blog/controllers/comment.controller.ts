import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query } from "@nestjs/common";
import { ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthDecorator } from "src/common/decorator/auth.decorator";
import { BlogCommentService } from "../services/comment.service";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";
import { CreateCommentDto } from "../dto/create-comment.dto";
import { plainToClass } from "class-transformer";
import { SkipAuth } from "src/common/decorator/skip-auth.decorator";
import { PaginationDto } from "src/common/dto/pagination.dto";

@Controller("blog-comment")
@ApiTags("Blog Comments")
@AuthDecorator()
export class BlogCommentController {
	constructor(private readonly commentService: BlogCommentService) {}

	/**
	 * New blog comment creation process
	 * @param {CreateCommentDto} createCommentDto - comment data sent by user
	 */
	@Post("/")
	@ApiConsumes(SwaggerConsumes.URL_ENCODED, SwaggerConsumes.JSON)
	create(@Body() createCommentDto: CreateCommentDto) {
		/** filter client data and remove unwanted data */
		const filteredData = plainToClass(CreateCommentDto, createCommentDto, {
			excludeExtraneousValues: true,
		});

		return this.commentService.create(filteredData);
	}

	/**
	 * Retrieve comments list by filter and search
	 */
	@Get("/")
	@SkipAuth()
	@ApiOperation({ description: "Note: Authorization not needed" })
	find(@Query() paginationDto: PaginationDto) {
		/** filter client pagination data and remove unwanted data */
		const filteredPaginationData = plainToClass(PaginationDto, paginationDto, {
			excludeExtraneousValues: true,
		});

		return this.commentService.commentsList(filteredPaginationData);
	}

	/**
	 * accept comment (Change accepted status to true)
	 */
	@Put("/accept/:id")
	accept(@Param("id", ParseIntPipe) id: number) {
		return this.commentService.accept(id);
	}

	/**
	 * reject comment (Change accepted status to false)
	 */
	@Put("/reject/:id")
	reject(@Param("id", ParseIntPipe) id: number) {
		return this.commentService.reject(id);
	}
}
