import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
} from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "../auth/guard/auth.guard";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";
import { plainToClass } from "class-transformer";
import { ApiCreateCategoryResponses } from "./decorators/create-category-responses.decorator";

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
	findAll() {
		return this.categoryService.findAll();
	}

	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.categoryService.findOne(+id);
	}

	@Patch(":id")
	update(
		@Param("id") id: string,
		@Body() updateCategoryDto: UpdateCategoryDto
	) {
		return this.categoryService.update(+id, updateCategoryDto);
	}

	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.categoryService.remove(+id);
	}
}
