import { Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BlogEntity } from "./entities/blog.entity";
import { Repository } from "typeorm";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { createSlug, randomId } from "src/common/utils/functions.utils";
import { BlogStatus } from "./enums/status.enum";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import {
	NotFoundMessage,
	SuccessMessage,
} from "src/common/enums/messages.enum";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { FindBlogsDto } from "./dto/filter.dto";
import { CategoryService } from "../category/category.service";
import { BlogCategoryEntity } from "./entities/blog-category.entity";
import { paginate, PaginatedResult } from "src/common/utils/pagination.utils";
import { EntityName } from "src/common/enums/entity.enum";

@Injectable({ scope: Scope.REQUEST })
export class BlogService {
	constructor(
		/** Register blog repository */
		@InjectRepository(BlogEntity)
		private blogRepository: Repository<BlogEntity>,

		/** Register blog category repository */
		@InjectRepository(BlogCategoryEntity)
		private blogCategoryRepository: Repository<BlogCategoryEntity>,

		/** Register current request */
		@Inject(REQUEST) private request: Request,

		/** Register category service */
		private categoryService: CategoryService
	) {}

	/**
	 * Create a new blog on user's request
	 * @param createBlogDto - Blog data sent by client
	 */
	async create(createBlogDto: CreateBlogDto) {
		/** Extract user's data from request */
		const user = this.request.user;

		/** Extract slug and title from sent data */
		let { slug, title, categories } = createBlogDto;

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
			categories: [],
			slug,
			status: BlogStatus.DRAFT,
			authorId: user.id,
		});

		/** Save blog data in database */
		blog = await this.blogRepository.save(blog);

		/** manage blog's categories */
		for (const categoryTitle of categories) {
			/** Retrieve category's data */
			let category = await this.categoryService.findOneByTitle(categoryTitle);

			/** Create the category if it was not found */
			if (!category) {
				category = await this.categoryService.insertByTitle(categoryTitle);
			}

			/** Save categories data in database */
			await this.blogCategoryRepository.insert({
				blogId: blog.id,
				categoryId: category.id,
			});
		}

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
	 * Retrieve all blogs list
	 * @param {PaginationDto} paginationDto - Pagination data such as page and limit
	 * @param {FindBlogsDto} filterDto - Filter data sent by user
	 * @returns {Promise<PaginatedResult<BlogEntity>>} - Paginated blogs list
	 */
	async blogsList(
		paginationDto: PaginationDto,
		filterDto: FindBlogsDto
	): Promise<PaginatedResult<BlogEntity>> {
		/** Destructure filter data */
		let { category, search } = filterDto;

		/** Define a temporary variable which will save database query where option */
		let where = "";

		/** Add category value to query's where in case it was provided */
		if (category) {
			category = category.toLowerCase();
			if (where.length > 0) where += " AND ";
			where += "category.title ILIKE :category";
		}

		/** Add search value to query's where in case it was provided */
		if (search) {
			if (where.length > 0) where += " AND ";
			search = `%${search}%`;
			where +=
				"CONCAT(blog.title, blog.description, blog.content) ILIKE :search";
		}

		/** Generate database query */
		const queryBuilder = this.blogRepository
			.createQueryBuilder(EntityName.BLOG)
			.leftJoin("blog.categories", "categories")
			.leftJoin("categories.category", "category")
			.addSelect(["categories.id", "category.title"])
			.where(where, { category, search })
			.orderBy("blog.id", "DESC");

		return await paginate(paginationDto, this.blogRepository, queryBuilder);
	}

	/**
	 * Blog removal process
	 * @param {number} id =Blog's id value
	 */
	async delete(id: number): Promise<string> {
		/** Check blog existence */
		await this.checkExistBlogById(id);
		/** Delete blog from database */
		await this.blogRepository.delete({ id });

		return SuccessMessage.Default;
	}

	/**
	 * Check if a blog exists with the give id
	 * @param {number} id =Blog's id value
	 * @returns {Promise<BlogEntity>} - Blog data
	 */
	async checkExistBlogById(id: number): Promise<BlogEntity> {
		/** Retrieve blog data from database */
		const blog = await this.blogRepository.findOneBy({ id });
		/** Throw error if the blog was not found */
		if (!blog) throw new NotFoundException(NotFoundMessage.Blog);

		return blog;
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
