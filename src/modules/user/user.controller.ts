import { Controller, Body, Put, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { ProfileDto } from "./dto/profile.dto";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";
import { plainToClass } from "class-transformer";
import { deleteInvalidPropertyInObject } from "src/common/utils/functions.utils";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { multerImageUploader } from "src/common/utils/multer.utils";
import { AuthDecorator } from "src/common/decorator/auth.decorator";
import { UploadedOptionalFiles } from "src/common/decorator/upload-file.decorator";
import { TProfileImages } from "./types/files.type";

@Controller("user")
@ApiTags("User")
@AuthDecorator()
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Put("/profile")
	@ApiConsumes(SwaggerConsumes.MULTIPART_FORM_DATA)
	@UseInterceptors(
		FileFieldsInterceptor(
			[
				{ name: "profile_image", maxCount: 1 },
				{ name: "profile_bg_image", maxCount: 1 },
			],
			multerImageUploader()
		)
	)
	async changeProfile(
		@UploadedOptionalFiles() files: TProfileImages,
		@Body() profileDto: ProfileDto
	) {
		/** filter client data and remove unwanted data */
		const filteredData = plainToClass(ProfileDto, profileDto, {
			excludeExtraneousValues: true,
		});

		/** Remove invalid data */
		deleteInvalidPropertyInObject(filteredData);

		return this.userService.changeProfile(files, filteredData);
	}
}
