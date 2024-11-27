import { Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BlogEntity } from "../entities/blog.entity";
import { Repository } from "typeorm";
import { CreateBlogDto } from "../dto/create-blog.dto";
import { createSlug, randomId } from "src/common/utils/functions.utils";
import { BlogStatus } from "../enums/status.enum";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import {
	NotFoundMessage,
	SuccessMessage,
} from "src/common/enums/messages.enum";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { FindBlogsDto } from "../dto/filter.dto";
import { CategoryService } from "../../category/category.service";
import { BlogCategoryEntity } from "../entities/blog-category.entity";
import { paginate, PaginatedResult } from "src/common/utils/pagination.utils";
import { EntityName } from "src/common/enums/entity.enum";
import { UpdateBlogDto } from "../dto/update-blog.dto";
import { isArray } from "class-validator";
import { BlogLikesEntity } from "../entities/like.entity";
import { BlogBookmarkEntity } from "../entities/bookmark.entity";

@Injectable({ scope: Scope.REQUEST })
export class BlogService {
	constructor(
		/** Register blog repository */
		@InjectRepository(BlogEntity)
		private blogRepository: Repository<BlogEntity>,

		/** Register blog category repository */
		@InjectRepository(BlogCategoryEntity)
		private blogCategoryRepository: Repository<BlogCategoryEntity>,

		/** Register blog like repository */
		@InjectRepository(BlogLikesEntity)
		private blogLikeRepository: Repository<BlogLikesEntity>,

		/** Register blog like repository */
		@InjectRepository(BlogBookmarkEntity)
		private blogBookmarkRepository: Repository<BlogBookmarkEntity>,

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
		await this.updateBlogCategories(blog.id, categories);

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
			.leftJoin("blog.author", "author")
			.leftJoin("author.profile", "profile")
			.addSelect([
				"categories.id",
				"category.title",
				"author.username",
				"author.id",
				"profile.nickname",
			])
			.where(where, { category, search })
			.loadRelationCountAndMap("blog.likes", "blog.likes")
			.loadRelationCountAndMap("blog.bookmarks", "blog.bookmarks")
			.loadRelationCountAndMap(
				"blog.comments",
				"blog.comments",
				"comments",
				(qb) => qb.where("comments.accepted= :accepted", { accepted: true })
			)
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
	 * Process of updating blog's data
	 * @param {number} id - Blog's id number
	 * @param {UpdateBlogDto} updateBlogDto - Blog's updated data
	 */
	async update(id: number, updateBlogDto: UpdateBlogDto) {
		/** Extract new data from sent data */
		let {
			title,
			slug: inputSlug,
			content,
			description,
			image,
			time_for_study,
			categories,
		} = updateBlogDto;

		/** Check if slug exists and retrieve it */
		const blog = await this.checkExistBlogById(id);

		/** Create new slug based on given data */
		let slug =
			(inputSlug && createSlug(inputSlug)) ||
			(title && createSlug(title)) ||
			blog.slug;

		/** Proceed if the blog's current slug was updated */
		if (slug !== blog.slug) {
			/** Check if the new slug already exists */
			const isExist = await this.checkBlogBySlug(slug);

			/** Add a random id to slug value if it was duplicated */
			if (isExist && isExist.id !== id) {
				slug += `-${randomId()}`;
			}

			/** Update blog's slug value */
			blog.slug = slug;
		}

		/** Merge updated fields into the existing blog object */
		Object.assign(blog, {
			title: title || blog.title,
			description: description || blog.description,
			content: content || blog.content,
			image: image || blog.image,
			time_for_study: time_for_study || blog.time_for_study,
		});

		/** Save updated blog data */
		await this.blogRepository.save(blog);

		/** manage blog's categories */
		if (isArray(categories) && categories.length > 0) {
			await this.updateBlogCategories(blog.id, categories, true);
		}

		return SuccessMessage.Default;
	}

	/**
	 * The process of toggling blog's like
	 * @param id - Blogs id number
	 */
	async likeBlog(id: number) {
		/** Extract user's id from request */
		const { id: userId } = this.request.user;

		/** Check if the blog exists */
		await this.checkExistBlogById(id);

		/** Check if the blog is liked already */
		const isLiked = await this.blogLikeRepository.findOneBy({
			userId,
			blogId: id,
		});

		/** Like the blog if it's not liked before OR dislike it if it's liked */
		if (!isLiked) {
			await this.blogLikeRepository.insert({ userId, blogId: id });
		} else {
			await this.blogLikeRepository.delete({ id: isLiked.id });
		}

		return SuccessMessage.Default;
	}

	/**
	 * The process of toggling blog's bookmark
	 * @param id - Blogs id number
	 */
	async bookmarkBlog(id: number) {
		/** Extract user's id from request */
		const { id: userId } = this.request.user;

		/** Check if the blog exists */
		await this.checkExistBlogById(id);

		/** Check if the blog is bookmarked already */
		const isBookmarked = await this.blogBookmarkRepository.findOneBy({
			userId,
			blogId: id,
		});

		/** bookmark the blog if it's not bookmarked before OR remove from bookmark it if it's bookmarked */
		if (!isBookmarked) {
			await this.blogBookmarkRepository.insert({ userId, blogId: id });
		} else {
			await this.blogBookmarkRepository.delete({ id: isBookmarked.id });
		}

		return SuccessMessage.Default;
	}

	/**
	 * Update blog categories
	 * @param {number} blogId - Blog's id number
	 * @param {string[] | string} categoryTitles - The Array of categories title
	 * @param {boolean} updateProcess - Determine whether this method was called during blog update process of not
	 */
	private async updateBlogCategories(
		blogId: number,
		categoryTitles: string[] | string,
		updateProcess: boolean = false
	) {
		/** Remove existing categories for the blog */
		if (updateProcess) {
			await this.blogCategoryRepository.delete({ blogId });
		}

		// Process each category
		for (const categoryTitle of categoryTitles) {
			/** Retrieve category's data */
			let category = await this.categoryService.findOneByTitle(categoryTitle);

			/** Create the category if it was not found */
			if (!category) {
				category = await this.categoryService.insertByTitle(categoryTitle);
			}

			/** Save categories data in database */
			await this.blogCategoryRepository.insert({
				blogId,
				categoryId: category.id,
			});
		}
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
