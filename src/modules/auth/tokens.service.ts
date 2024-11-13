import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TJwtPayload } from "./types/payload";
import { AuthMessage } from "src/common/enums/messages.enum";

@Injectable()
export class TokenService {
	constructor(
		/** register jwt service */
		private jwtService: JwtService
	) {}

	/**
	 * Create and return JWT OTP token
	 * @param {JwtPayload} payload - Data that will be used in token
	 * @returns {string} - JWT token
	 */
	createOtpToken(payload: TJwtPayload): string {
		/** create otp token */
		return this.jwtService.sign(payload, {
			secret: process.env.OTP_TOKEN_SECRET,
			expiresIn: 60 * 2, // 2 Mins
		});
	}

	/**
	 * Verify JWT OTP Token
	 * @param {string} token - Client's OTP Token
	 * @throws {UnauthorizedException} Throws exceptions if the token is invalid or missing.
	 * @returns {TJwtPayload} - Data object saved in JWT Payload
	 */
	verifyOtpToken(token: string): TJwtPayload | never {
		try {
			/** Verify OTP JWT token */
			const payload = this.jwtService.verify(token, {
				secret: process.env.OTP_TOKEN_SECRET,
			});

			/** Throw error in case of invalid payload */
			if (typeof payload !== "object" && !("id" in payload)) {
				throw new UnauthorizedException(AuthMessage.AuthorizationFailed);
			}

			return payload;
		} catch (error) {
			throw new UnauthorizedException(AuthMessage.AuthorizationFailed);
		}
	}

	/**
	 * Create and return JWT access token
	 * @param {JwtPayload} payload - Data that will be used in token
	 * @returns {string} - JWT token
	 */
	createAccessToken(payload: TJwtPayload): string {
		return this.jwtService.sign(payload, {
			secret: process.env.ACCESS_TOKEN_SECRET,
			expiresIn: "1y",
		});
	}

	/**
	 * Verify JWT access Token
	 * @param {string} token - Client's access Token
	 * @returns {TJwtPayload} - Data object saved in JWT Payload
	 */
	verifyAccessToken(token: string): TJwtPayload {
		try {
			/** Verify access token */
			const payload = this.jwtService.verify(token, {
				secret: process.env.ACCESS_TOKEN_SECRET,
			});

			/** Throw error in case of invalid payload */
			if (typeof payload !== "object" && !("id" in payload)) {
				throw new UnauthorizedException(AuthMessage.AuthorizationFailed);
			}

			return payload;
		} catch (error) {
			throw new UnauthorizedException(AuthMessage.AuthorizationFailed);
		}
	}
}
