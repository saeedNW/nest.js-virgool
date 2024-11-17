import {
	Controller,
	Body,
	Put,
	UseInterceptors,
	Get,
	Patch,
	Res,
	Post,
} from "@nestjs/common";
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
import { ApiChangeProfileResponses } from "./decorators/change-profile-responses.decorator";
import { ApiGetProfileResponses } from "./decorators/get-profile-responses.decorator";
import { ChangeEmailDto } from "./dto/change-email.dto";
import { Response } from "express";
import { CheckOtpDto } from "../auth/dto/check-otp.dto";

@Controller("user")
@ApiTags("User")
@AuthDecorator()
export class UserController {
	constructor(private readonly userService: UserService) {}

	/**
	 * Controller of the process of updating user profile information
	 * @param {TProfileImages} files - Optional uploaded files
	 * @param {ProfileDto} profileDto - Profile data sent by user to be updated
	 */
	@Put("/profile")
	@ApiConsumes(SwaggerConsumes.MULTIPART_FORM_DATA)
	@ApiChangeProfileResponses()
	//? In order to register file uploader on an endpoint it should be register as an interceptor
	@UseInterceptors(
		//? NestJS core interceptor to activate the upload process on an endpoint
		FileFieldsInterceptor(
			//? Define the name of the fields which will upload a file from and how many files
			//? are suppose to be uploaded from each
			[
				{ name: "profile_image", maxCount: 1 },
				{ name: "profile_bg_image", maxCount: 1 },
			],
			//? Register Upload manager function
			multerImageUploader()
		)
	)
	changeProfile(
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

	/**
	 * Controller of the process of retrieving user's profile data
	 */
	@Get("/profile")
	@ApiGetProfileResponses()
	grtProfile() {
		return this.userService.getProfile();
	}

	/**
	 * update user's email process controller
	 * @param {ChangeEmailDto} emailDto - the data sent by client
	 * @param {Response} response - Client's current response
	 */
	@Patch("/change-email")
	@ApiConsumes(SwaggerConsumes.URL_ENCODED, SwaggerConsumes.JSON)
	changeEmail(
		@Body() emailDto: ChangeEmailDto,
		@Res({ passthrough: true }) response: Response
	) {
		return this.userService.changeEmail(emailDto.email, response);
	}

	@Post("/verify-email")
	@ApiConsumes(SwaggerConsumes.URL_ENCODED, SwaggerConsumes.JSON)
	async verifyEmail(@Body() otpDto: CheckOtpDto) {
		return this.userService.verifyEmail(otpDto.code);
	}
}
