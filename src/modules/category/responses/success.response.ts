import { ApiProperty } from "@nestjs/swagger";
import {
	CreateApiBaseResponse,
	OkApiBaseResponse,
} from "src/common/abstracts/base.response";
import { CategoryEntity } from "../entities/category.entity";

/**
 * Create category process success response
 */
export class CreateCategorySuccess extends CreateApiBaseResponse {}

/**
 * Find all categories process success response
 */
export class FindAllCategoriesSuccess extends OkApiBaseResponse {
	@ApiProperty({
		description: "Response data",
		example: {
			items: [
				{
					id: 1,
					created_at: "2024-11-13T14:28:37.380Z",
					updated_at: "2024-11-13T14:28:37.380Z",
					title: "programming",
					priority: 12,
				},
				{
					id: 2,
					created_at: "2024-11-13T14:28:37.380Z",
					updated_at: "2024-11-13T14:28:37.380Z",
					title: "Design",
					priority: 13,
				},
			],
			meta: {
				totalItems: 2,
				itemCount: 2,
				itemsPerPage: 10,
				totalPages: 1,
				currentPage: 1,
			},
			links: {
				first: "http://localhost:3000?limit=10",
				previous: "",
				next: "",
				last: "http://localhost:3000?page=1&limit=10",
			},
		},
	})
	data: {
		items: [CategoryEntity];
		meta: {
			totalItems: number;
			itemCount: number;
			itemsPerPage: number;
			totalPages: number;
			currentPage: number;
		};
		links: {
			first: string;
			previous: string;
			next: string;
			last: string;
		};
	};
}

/**
 * Find one category process success response
 */
export class FindOneCategoriesSuccess extends OkApiBaseResponse {
	@ApiProperty({
		description: "Response data",
		example: {
			id: 1,
			created_at: "2024-11-13T14:28:37.380Z",
			updated_at: "2024-11-13T14:28:37.380Z",
			title: "programming",
			priority: 12,
		},
	})
	data: CategoryEntity;
}

/**
 * update category process success response
 */
export class UpdateCategorySuccess extends OkApiBaseResponse {}
/**
 * Delete category process success response
 */
export class DeleteCategorySuccess extends OkApiBaseResponse {}
