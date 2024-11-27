import { Inject, Injectable, Scope } from "@nestjs/common";
import { CreateCommentDto } from "../dto/create-comment.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { BlogEntity } from "../entities/blog.entity";
import { Repository } from "typeorm";
import { BlogCommentEntity } from "../entities/comments.entity";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { BlogService } from "./blog.service";
import { SuccessMessage } from "src/common/enums/messages.enum";

@Injectable({ scope: Scope.REQUEST })
export class BlogCommentService {
	constructor(
		/** Register blog repository */
		@InjectRepository(BlogEntity)
		private blogRepository: Repository<BlogEntity>,

		/** Register blog comment repository */
		@InjectRepository(BlogCommentEntity)
		private blogCommentRepository: Repository<BlogCommentEntity>,

		/** Register current request */
		@Inject(REQUEST) private request: Request,

		/** Register blog service */
		private blogService: BlogService
	) {}

	/**
	 * Service of the process of creating a new comment
	 * @param {CreateCommentDto} createCommentDto - comment data sent by user
	 */
	async create(createCommentDto: CreateCommentDto) {
		/** Extract user's id from request */
		const { id: userId } = this.request.user;

		/** Destructure the comments data */	
		const { parentId, text, blogId } = createCommentDto;

		/** Check if the blog exists */
		await this.blogService.checkExistBlogById(blogId);

		/** Check parent comment existence */
		let parent = null;
		if (parentId) {
			parent = await this.blogCommentRepository.findOneBy({ id: parentId });
		}

		/** Insert new comment into database */
		await this.blogCommentRepository.insert({
			text,
			blogId,
			userId,
			accepted: true,
			parentId: !parent ? null : parentId,
		});

		return SuccessMessage.Default;
	}
}
