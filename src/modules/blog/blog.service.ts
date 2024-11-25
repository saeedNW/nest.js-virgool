import { Inject, Injectable, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BlogEntity } from "./entities/blog.entity";
import { Repository } from "typeorm";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { createSlug, randomId } from "src/common/utils/functions.utils";
import { BlogStatus } from "./enums/status.enum";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { SuccessMessage } from "src/common/enums/messages.enum";

@Injectable({ scope: Scope.REQUEST })
export class BlogService {
	constructor(
		/** Register blog repository */
		@InjectRepository(BlogEntity)
		private blogRepository: Repository<BlogEntity>,

		/** Register current request */
		@Inject(REQUEST) private request: Request
	) {}

	/**
	 * Create a new blog on user's request
	 * @param createBlogDto - Blog data sent by client
	 */
	async create(createBlogDto: CreateBlogDto) {
		/** Extract user's data from request */
		const user = this.request.user;

		/** Extract slug and title from sent data */
		let { slug, title } = createBlogDto;

		/** Create a valid slug */
		let slugDate = slug ?? title;
		slug = createSlug(slugDate);

		/** Check if slug exists */
		const isExist = await this.checkBlogBySlug(slug);

		/** Add a random id to slug value if it was duplicated */
		if (isExist) {
			slug += `-${randomId()}`;
		}

		/** Create a new blog */
		let blog: BlogEntity = this.blogRepository.create({
			...createBlogDto,
			slug,
			status: BlogStatus.DRAFT,
			authorId: user.id,
		});

		/** Save blog data in database */
		blog = await this.blogRepository.save(blog);

		return SuccessMessage.Default;
	}

	/**
	 * Retrieve user's blogs
	 * @returns {Promise<BlogEntity[]>} - User's blogs data
	 */
	async myBlogs(): Promise<BlogEntity[]> {
		/** Retrieve user's id from request */
		const { id: userId } = this.request.user;

		/** Retrieve user's blogs from database */
		return this.blogRepository.find({
			where: {
				authorId: userId,
			},
			order: {
				id: "DESC",
			},
		});
	}

	/**
	 * Check if a blog exists with the give slug
	 * @param {string } slug =Blog's slug value
	 * @returns {Promise<BlogEntity>} - Blog data
	 */
	async checkBlogBySlug(slug: string): Promise<BlogEntity> {
		/** Retrieve blog data from database */
		const blog: BlogEntity = await this.blogRepository.findOneBy({ slug });

		return blog;
	}
}
