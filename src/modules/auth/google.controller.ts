import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { Request } from "express";

@Controller("/auth/google")
@ApiTags("Google Auth")
//? Make the controller to use passport module's
//? google strategy auth guard
@UseGuards(AuthGuard("google"))
export class GoogleAuthController {
	constructor(private authService: AuthService) {}

	/**
	 * Show and manage google login window
	 * @param req - Client's current request
	 */
	@Get()
	googleLogin(@Req() req: Request) {}

	/**
	 * Google authorization redirect manager
	 * @param req - Client's current request
	 */
	@Get("/redirect")
	googleRedirect(@Req() req: Request) {
		const userData = req.user;
		return this.authService.googleAuth(userData);
	}
}
