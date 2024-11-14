import { ConflictException, Injectable } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryEntity } from "./entities/category.entity";
import { Repository } from "typeorm";
import {
	ConflictMessage,
	SuccessMessage,
} from "src/common/enums/messages.enum";

@Injectable()
export class CategoryService {
	constructor(
		/** Register category repository */
		@InjectRepository(CategoryEntity)
		private categoryRepository: Repository<CategoryEntity>
	) {}

	async create(createCategoryDto: CreateCategoryDto) {
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

	findAll() {
		return this.categoryRepository.find();
	}

	findOne(id: number) {
		return `This action returns a #${id} category`;
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
	async checkExistAndResolveTitle(title: string): Promise<string> {
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
