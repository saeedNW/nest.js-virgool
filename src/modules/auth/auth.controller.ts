import { Body, Controller, Post, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { AuthDto } from "./dto/auth.dto";
import { plainToClass } from "class-transformer";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";
import { Response } from "express";
import { ApiUserExistenceResponses } from "./decorators/user-existence-responses.decorator";

@Controller("auth")
@ApiTags("Auth") //? Activate swagger for this module by defining a swagger API tag
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	/**
	 * users' login/register process controller
	 * @param {AuthDto} authDto - Data sent by client
	 */
	@Post("user-existence")
	//? Define swagger input type
	@ApiConsumes(SwaggerConsumes.URL_ENCODED, SwaggerConsumes.JSON)
	//? use a custom decorator for swagger response examples to keep the controller code clean
	@ApiUserExistenceResponses()
	userExistence(@Body() authDto: AuthDto, @Res() res: Response) {
		/** filter client data and remove unwanted data */
		const filteredData = plainToClass(AuthDto, authDto, {
			excludeExtraneousValues: true,
		});

		return this.authService.userExistence(filteredData, res);
	}
}
