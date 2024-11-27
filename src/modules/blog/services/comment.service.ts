import {
	BadRequestException,
	Inject,
	Injectable,
	NotFoundException,
	Scope,
} from "@nestjs/common";
import { CreateCommentDto } from "../dto/create-comment.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { BlogEntity } from "../entities/blog.entity";
import { Repository } from "typeorm";
import { BlogCommentEntity } from "../entities/comments.entity";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { BlogService } from "./blog.service";
import {
	BadRequestMessage,
	NotFoundMessage,
	SuccessMessage,
} from "src/common/enums/messages.enum";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { paginate, PaginatedResult } from "src/common/utils/pagination.utils";
import { EntityName } from "src/common/enums/entity.enum";

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

	/**
	 * Retrieve all comments list
	 * @param {PaginationDto} paginationDto - Pagination data such as page and limit
	 * @returns {Promise<PaginatedResult<BlogEntity>>} - Paginated comments list
	 */
	async commentsList(
		paginationDto: PaginationDto
	): Promise<PaginatedResult<BlogCommentEntity>> {
		/** Generate database query */
		const queryBuilder = this.blogCommentRepository
			.createQueryBuilder(EntityName.BLOG_COMMENTS)
			.leftJoin("blog_comments.blog", "blog")
			.leftJoin("blog_comments.user", "user")
			.leftJoin("user.profile", "profile")
			.addSelect(["blog.title", "user.username", "profile.nickname"])
			// .where("blog_comments.accepted= :accepted", { accepted: true })
			.orderBy("blog_comments.id", "DESC");

		return await paginate(
			paginationDto,
			this.blogCommentRepository,
			queryBuilder,
			process.env.SERVER_LINK + "/blog-comment"
		);
	}

	/**
	 * The process of accepting the comment
	 * @param {number} id - comment id number
	 */
	async accept(id: number) {
		/** Check if the comment exists */
		const comment = await this.checkExistCommentById(id);

		/** Throw error if the comment has already been accepted */
		if (comment.accepted) {
			throw new BadRequestException(BadRequestMessage.AlreadyAcceptedComment);
		}

		/** Toggle comment accepted status to true */
		comment.accepted = true;

		/** Save comment new status */
		await this.blogCommentRepository.save(comment);

		return SuccessMessage.Default;
	}

	/**
	 * The process of rejecting the comment
	 * @param {number} id - comment id number
	 */
	async reject(id: number) {
		/** Check if the comment exists */
		const comment = await this.checkExistCommentById(id);

		/** Throw error if the comment has already been rejected */
		if (!comment.accepted) {
			throw new BadRequestException(BadRequestMessage.AlreadyRejectedComment);
		}

		/** Toggle comment accepted status to false */
		comment.accepted = false;

		/** Save comment new status */
		await this.blogCommentRepository.save(comment);

		return SuccessMessage.Default;
	}

	/**
	 * Check if a comment exists with the give id
	 * @param {number} id - comment's id value
	 * @returns {Promise<BlogCommentEntity>} - comment data
	 */
	async checkExistCommentById(id: number): Promise<BlogCommentEntity> {
		/** Retrieve comment data from database */
		const comment = await this.blogCommentRepository.findOneBy({ id });
		/** Throw error if the comment was not found */
		if (!comment) throw new NotFoundException(NotFoundMessage.Comment);

		return comment;
	}
}