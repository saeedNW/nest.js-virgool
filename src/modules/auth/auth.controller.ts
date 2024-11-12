import { Body, Controller, Post, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
	ApiBadRequestResponse,
	ApiConflictResponse,
	ApiConsumes,
	ApiCreatedResponse,
	ApiTags,
	ApiUnauthorizedResponse,
	ApiUnprocessableEntityResponse,
} from "@nestjs/swagger";
import { AuthDto } from "./dto/auth.dto";
import { plainToClass } from "class-transformer";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";
import { Response } from "express";
import { SendOtpBadRequest } from "./Responses/bad-request.response";
import { SendOtpSuccess } from "./Responses/success.response";
import { SendOtpUnauthorized } from "./Responses/unauthorized.response";
import { SendOtpConflict } from "./Responses/conflict.response";
import { SendOtpUnprocessable } from "./Responses/unprocessable.response";

@Controller("auth")
@ApiTags("Auth") //? Activate swagger for this module by defining a swagger API tag
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	/**
	 * users' login/register process controller
	 * @param {AuthDto} authDto - Data sent by client
	 */
	@Post("user-existence")
	@ApiConsumes(SwaggerConsumes.URL_ENCODED, SwaggerConsumes.JSON) //? Define swagger input type
	@ApiCreatedResponse({
		description: "Success Response",
		type: SendOtpSuccess,
	})
	@ApiBadRequestResponse({
		description: "Bad Request Response",
		type: SendOtpBadRequest,
	})
	@ApiUnauthorizedResponse({
		description: "Unauthorized Response",
		type: SendOtpUnauthorized,
	})
	@ApiConflictResponse({
		description: "Conflict Response",
		type: SendOtpConflict,
	})
	@ApiUnprocessableEntityResponse({
		description: "Unprocessable Entity Response",
		type: SendOtpUnprocessable,
	})
	userExistence(@Body() authDto: AuthDto, @Res() res: Response) {
		/** filter client data and remove unwanted data */
		const filteredData = plainToClass(AuthDto, authDto, {
			excludeExtraneousValues: true,
		});

		return this.authService.userExistence(filteredData, res);
	}
}
