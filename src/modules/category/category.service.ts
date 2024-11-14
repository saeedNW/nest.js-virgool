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

	update(id: number, updateCategoryDto: UpdateCategoryDto) {
		return `This action updates a #${id} category`;
	}

	remove(id: number) {
		return `This action removes a #${id} category`;
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
