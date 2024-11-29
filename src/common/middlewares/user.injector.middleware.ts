import { Injectable, NestMiddleware } from "@nestjs/common";
import { isJWT } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { AuthService } from "src/modules/auth/auth.service";

@Injectable()
export class UserInjector implements NestMiddleware {
	constructor(private authService: AuthService) {}

	async use(req: Request, res: Response, next: NextFunction) {
		/** Extract access token from headers */
		const token = this.extractToken(req);


		/** Proceed to nest method if the token was not found */
		if (!token) return next();

		try {
			/** Validate access token */
			let user = await this.authService.validateAccessToken(token);
			/** add user's data to request */
			if (user) req.user = user;
		} catch (error) {
			console.log(error);
		}

		next();
	}

	protected extractToken(request: Request) {
		/** extract authorization header */
		const { authorization } = request.headers;

		/** Return null if header was not found or it was empty */
		if (!authorization || authorization?.trim() == "") {
			return null;
		}

		/** Destructure authorization data */
		const [bearer, token] = authorization?.split(" ");

		/** Return null if token is invalid */
		if (bearer?.toLowerCase() !== "bearer" || !token || !isJWT(token)) {
			return null;
		}

		return token;
	}
}
