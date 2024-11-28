import {
	BadRequestException,
	forwardRef,
	Inject,
	Injectable,
	NotFoundException,
	Scope,
} from "@nestjs/common";
import { CreateCommentDto } from "../dto/create-comment.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { BlogEntity } from "../entities/blog.entity";
import { IsNull, Repository } from "typeorm";
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

		/**
		 * Register blog service
		 *
		 * ? Circular dependency alert: The BlogService and BlogCommentService
		 * ? import each other, creating a circular dependency.
		 *
		 * ? Circular dependencies can occur when two services, such as BlogService
		 * ? and BlogCommentService, depend on each other. This can lead to an error
		 * ? that prevents the application from starting.
		 *
		 * ? In such cases, the `forwardRef` utility can be used to resolve the issue.
		 * ? By wrapping a dependency with `forwardRef` and combining it with the
		 * ? `@Inject` decorator, NestJS can delay the resolution of the dependency
		 * ? until it is needed. This approach is particularly useful when two modules
		 * ? or services reference each other directly.
		 *
		 * ? Refer to the NestJS documentation for more details on using `forwardRef`
		 * ? effectively in scenarios involving circular dependencies.
		 */
		@Inject(forwardRef(() => BlogService))
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
	 * Retrieve all comments that are belong to a certain blog post
	 * @param {number} blogId - The Id of the blog that its comments are requested
	 * @param {PaginationDto} paginationDto - Pagination data such as page and limit
	 * @returns {Promise<PaginatedResult<BlogCommentEntity>>} - Paginated comments list
	 */
	async findCommentsOfBlog(
		blogId: number,
		paginationDto: PaginationDto
	): Promise<PaginatedResult<BlogCommentEntity>> {
		/**
		 * Generate database query
		 * ? NOTE: The `createQueryBuilder` API in TypeORM is not inherently designed
		 * ? to handle deeply nested relations dynamically. To retrieve such nested
		 * ? relations, you must explicitly define each relationship at every level.
		 *
		 * ? If dynamic handling of deeply nested relations is required, consider
		 * ? alternative approaches. One option is to fetch all comments and their
		 * ? relations in a single query, then manually group them.
		 *
		 * ? For an example of this approach, refer to the `getNestedComments`
		 * ? method in this file.
		 */
		const queryBuilder = this.blogCommentRepository
			.createQueryBuilder(EntityName.BLOG_COMMENTS)
			.where({ blogId, parentId: IsNull() })
			.leftJoin("blog_comments.user", "user")
			.leftJoin("user.profile", "userProfile")
			.leftJoin("blog_comments.children", "childComments")
			.leftJoin("childComments.user", "childUser")
			.leftJoin("childUser.profile", "childUserProfile")
			.leftJoin("childComments.children", "grandChildComments")
			.leftJoin("grandChildComments.user", "grandChildUser")
			.leftJoin("grandChildUser.profile", "grandChildUserProfile")
			.select([
				"blog_comments.id",
				"blog_comments.text",
				"blog_comments.created_at",
				"user.username",
				"userProfile.nickname",

				"childComments.id",
				"childComments.text",
				"childComments.created_at",
				"childUser.username",
				"childUserProfile.nickname",

				"grandChildComments.id",
				"grandChildComments.text",
				"grandChildComments.created_at",
				"grandChildUser.username",
				"grandChildUserProfile.nickname",
			])
			.orderBy("blog_comments.id", "DESC");

		return await paginate(
			paginationDto,
			this.blogCommentRepository,
			queryBuilder,
			process.env.SERVER_LINK + decodeURI(this.request.url.split("?")[0])
		);
	}

	/**
	 * Retrieve comments and their children comments dynamically
	 * @param {number} blogId - The Id of the blog that its comments are requested
	 */
	async getNestedComments(blogId: number) {
		/** Retrieve all comment data and their relations */
		const flatComments = await this.blogCommentRepository.find({
			where: { blogId },
			relations: ["user.profile", "children.user.profile"], // Include necessary relations
			select: {
				id: true,
				text: true,
				created_at: true,
				parentId: true,
				user: {
					username: true,
					profile: {
						nickname: true,
					},
				},
				children: {
					id: true,
					text: true,
					created_at: true,
					parentId: true,
					user: {
						username: true,
						profile: {
							nickname: true,
						},
					},
				},
			},
			order: { id: "DESC" },
		});

		// Helper function to group comments manually
		function buildTree(comments, parentId = null) {
			return comments
				.filter((comment) => comment.parentId === parentId)
				.map((comment) => ({
					...comment,
					children: buildTree(comments, comment.id),
				}));
		}

		const nestedComments = buildTree(flatComments);

		return nestedComments;
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
