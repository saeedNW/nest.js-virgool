import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	UseInterceptors,
	UploadedFile,
	ParseIntPipe,
} from "@nestjs/common";
import { ImageService } from "./image.service";
import { ImageDto } from "./dto/image.dto";
import { AuthDecorator } from "src/common/decorator/auth.decorator";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";
import { FileInterceptor } from "@nestjs/platform-express";
import { plainToClass } from "class-transformer";
import {
	multerImageUploader,
	TMulterFile,
} from "src/common/utils/multer.utils";

@Controller("image")
@ApiTags("image")
@AuthDecorator()
export class ImageController {
	constructor(private readonly imageService: ImageService) {}

	/**
	 * Upload new image into gallery
	 * @param {TMulterFile} image - Uploaded file
	 * @param {ImageDto} imageDto - uploaded file data
	 */
	@Post()
	@ApiConsumes(SwaggerConsumes.MULTIPART_FORM_DATA)
	@UseInterceptors(FileInterceptor("image", multerImageUploader()))
	create(@UploadedFile() image: TMulterFile, @Body() imageDto: ImageDto) {
		/** filter client data and remove unwanted data */
		const filteredData = plainToClass(ImageDto, imageDto, {
			excludeExtraneousValues: true,
		});

		return this.imageService.create(image, filteredData);
	}

	@Get()
	findAll() {
		return this.imageService.findAll();
	}

	@Delete(":id")
	remove(@Param("id", ParseIntPipe) id: number) {
		return this.imageService.remove(id);
	}
}
