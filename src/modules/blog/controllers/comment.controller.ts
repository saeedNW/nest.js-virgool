import { Body, Controller, Post } from "@nestjs/common";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { AuthDecorator } from "src/common/decorator/auth.decorator";
import { BlogCommentService } from "../services/comment.service";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";
import { CreateCommentDto } from "../dto/create-comment.dto";
import { plainToClass } from "class-transformer";

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
}
