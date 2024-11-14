import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	Query,
	ParseIntPipe,
} from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import {
	ApiBearerAuth,
	ApiConsumes,
	ApiOkResponse,
	ApiTags,
} from "@nestjs/swagger";
import { AuthGuard } from "../auth/guard/auth.guard";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";
import { plainToClass } from "class-transformer";
import { ApiCreateCategoryResponses } from "./decorators/create-category-responses.decorator";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { ApiFindAllCategoriesResponses } from "./decorators/find-all-response.decorator";
import { FindOneCategoriesSuccess } from "./responses/success.response";
import { ApiFindOneCategoriesResponses } from "./decorators/find-one-response.decorator";
import { ApiDeleteCategoriesResponses } from "./decorators/delete-category-response.decorator";
import { deleteInvalidPropertyInObject } from "src/common/utils/functions.utils";
import { ApiUpdateCategoriesResponses } from "./decorators/update-category-response.decorator";

@Controller("category")
@ApiTags("Category")
@UseGuards(AuthGuard)
@ApiBearerAuth("Authorization")
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {}

	@Post()
	@ApiConsumes(SwaggerConsumes.URL_ENCODED, SwaggerConsumes.JSON)
	@ApiCreateCategoryResponses()
	create(@Body() createCategoryDto: CreateCategoryDto) {
		/** filter client data and remove unwanted data */
		const filteredData = plainToClass(CreateCategoryDto, createCategoryDto, {
			excludeExtraneousValues: true,
		});

		return this.categoryService.create(filteredData);
	}

	@Get()
	@ApiFindAllCategoriesResponses()
	findAll(@Query() paginationDto: PaginationDto) {
		/** filter client data and remove unwanted data */
		const filteredData = plainToClass(PaginationDto, paginationDto, {
			excludeExtraneousValues: true,
		});

		return this.categoryService.findAll(filteredData);
	}

	@Get(":id")
	@ApiFindOneCategoriesResponses()
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.categoryService.findOne(id);
	}

	@Patch(":id")
	@ApiConsumes(SwaggerConsumes.URL_ENCODED, SwaggerConsumes.JSON)
	@ApiUpdateCategoriesResponses()
	update(
		@Param("id", ParseIntPipe) id: number,
		@Body() updateCategoryDto: UpdateCategoryDto
	) {
		/** filter client data and remove unwanted data */
		const filteredData = plainToClass(UpdateCategoryDto, updateCategoryDto, {
			excludeExtraneousValues: true,
		});

		/** Remove invalid data */
		deleteInvalidPropertyInObject(filteredData);

		return this.categoryService.update(id, filteredData);
	}

	@Delete(":id")
	@ApiDeleteCategoriesResponses()
	remove(@Param("id", ParseIntPipe) id: number) {
		return this.categoryService.remove(+id);
	}
}
