import {
	Body,
	Controller,
	Get,
	Post,
	Req,
	Res,
	UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { AuthDto } from "./dto/auth.dto";
import { plainToClass } from "class-transformer";
import { SwaggerConsumes } from "src/common/enums/swagger-consumes.enum";
import { Request, Response } from "express";
import { CheckOtpDto } from "./dto/check-otp.dto";
import { ApiUserExistenceResponses } from "./decorators/user-existence-responses.decorator";
import { ApiCheckOtpResponses } from "./decorators/check-otp-responses.decorator";
import { AuthGuard } from "./guard/auth.guard";

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

	/**
	 * users' check OTP process controller
	 * @param {CheckOtpDto} checkOtpDto - Data sent by client
	 */
	@Post("check-otp")
	@ApiConsumes(SwaggerConsumes.URL_ENCODED, SwaggerConsumes.JSON)
	@ApiCheckOtpResponses()
	checkOTP(@Body() checkOtpDto: CheckOtpDto) {
		/** filter client data and remove unwanted data */
		const { code } = plainToClass(CheckOtpDto, checkOtpDto, {
			excludeExtraneousValues: true,
		});

		return this.authService.checkOtp(code);
	}

	/**
	 * Check if user has been authorized and then request their data object
	 * @param {Request} req - Client's current request
	 * @returns Users data
	 */
	@Get("check-login")
	@ApiBearerAuth("Authorization") //? Activate authorization requirement for the endpoint in swagger ui
	@UseGuards(AuthGuard) //? Activate auth guard for the check-login endpoint
	checkLogin(@Req() req: Request) {
		return req.user;
	}
}
