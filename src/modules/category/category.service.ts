import {
	ConflictException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryEntity } from "./entities/category.entity";
import { Repository } from "typeorm";
import {
	ConflictMessage,
	NotFoundMessage,
	SuccessMessage,
} from "src/common/enums/messages.enum";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { paginate, Pagination } from "nestjs-typeorm-paginate";

@Injectable()
export class CategoryService {
	constructor(
		/** Register category repository */
		@InjectRepository(CategoryEntity)
		private categoryRepository: Repository<CategoryEntity>
	) {}

	/**
	 * category creation process service
	 * @param {CreateCategoryDto} createCategoryDto - category data sent by user
	 * @returns {Promise<string>|never} - Return process result message
	 */
	async create(createCategoryDto: CreateCategoryDto): Promise<string> | never {
		/** Destruct the data object sent by user */
		let { priority, title } = createCategoryDto;
		/** Check if the title is duplicated or not */
		title = await this.checkExistAndResolveTitle(title);
		/** Convert priority data to be a number */
		priority = +priority || undefined;

		/** Create an instance of category entity by given data */
		const category = this.categoryRepository.create({
			title,
			priority,
		});
		/** Save category data in database */
		await this.categoryRepository.save(category);

		return SuccessMessage.CreateCategory;
	}

	/**
	 * add new category by its title
	 * @param {string} title - category data sent by user
	 * @returns {Promise<CategoryEntity>} - Return newly added category data
	 */
	async insertByTitle(title: string): Promise<CategoryEntity> {
		/** Create an instance of category entity by given data */
		const category = this.categoryRepository.create({ title });
		/** Save category data in database */
		return this.categoryRepository.save(category);
	}

	/**
	 * Retrieve categories data in pagination
	 * @param {PaginationDto} paginationDto - Pagination data such as page and limit
	 * @returns {Promise<Pagination<CategoryEntity>>} Founded data plus pagination meta data
	 */
	async findAll(
		paginationDto: PaginationDto
	): Promise<Pagination<CategoryEntity>> {
		/** Retrieve categories using `paginate method from `nestjs-typeorm-paginate` module */
		return paginate<CategoryEntity>(this.categoryRepository, {
			...paginationDto,
			route: process.env.SERVER_LINK,
		});
	}

	/**
	 * Retrieve single category by id number
	 * @param {number} id category's id number
	 * @returns {Promise<CategoryEntity>} Single category data object
	 */
	async findOne(id: number): Promise<CategoryEntity> {
		/** Retrieve category's data from database */
		const category = await this.categoryRepository.findOneBy({ id });
		/** throw error if category was not found */
		if (!category) throw new NotFoundException(NotFoundMessage.Category);
		/** return category's data object */
		return category;
	}

	/**
	 * Retrieve single category by title
	 * @param {string} title category's title
	 * @returns {Promise<CategoryEntity>} Single category data object
	 */
	async findOneByTitle(title: string): Promise<CategoryEntity> {
		/** Retrieve category's data from database */
		return await this.categoryRepository.findOneBy({ title });
	}

	async update(id: number, updateCategoryDto: UpdateCategoryDto) {
		/** check if category exist */
		await this.findOne(id);
		/** Update category data */
		await this.categoryRepository.update({ id }, { ...updateCategoryDto });
		/** send success message */
		return SuccessMessage.UpdateCategory;
	}

	/**
	 * Remove category by id number
	 * @param {number} id category's id number
	 * @returns {Promise<string>} success message
	 */
	async remove(id: number): Promise<string> {
		/** check if category exist */
		await this.findOne(id);
		/** remove category */
		await this.categoryRepository.delete({ id });
		/** return success response */
		return SuccessMessage.RemoveCategory;
	}

	/**
	 * Check if the Chosen category title is duplicated
	 * @param {string} title - Category title sent by user request
	 * @throws {ConflictException} - In case of duplicated title throw "Conflict Exception" error
	 * @returns {string|never} - Return the title in case ii's not duplicated
	 */
	async checkExistAndResolveTitle(title: string): Promise<string> | never {
		/** trim and lower case the title */
		title = title?.trim()?.toLowerCase();
		/** Retrieve category data from database by its title */
		const category: CategoryEntity = await this.categoryRepository.findOneBy({
			title,
		});
		/** Throw error if the title is duplicated */
		if (category) throw new ConflictException(ConflictMessage.CategoryTitle);
		/** return the validated title */
		return title;
	}
}
