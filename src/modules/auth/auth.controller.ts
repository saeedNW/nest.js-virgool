import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { AuthDto } from "./dto/auth.dto";
import { plainToClass } from "class-transformer";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";

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
	userExistence(@Body() authDto: AuthDto) {
		/** filter client data and remove unwanted data */
		const filteredData = plainToClass(AuthDto, authDto, {
			excludeExtraneousValues: true,
		});

		return this.authService.userExistence(filteredData);
	}
}
