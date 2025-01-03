import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TJwtEmailPayload, TJwtOtpPayload, TJwtPhonePayload } from "./types/payload";
import { AuthMessage, BadRequestMessage } from "src/common/enums/messages.enum";

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
	createOtpToken(payload: TJwtOtpPayload): string {
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
	 * @returns {TJwtOtpPayload} - Data object saved in JWT Payload
	 */
	verifyOtpToken(token: string): TJwtOtpPayload | never {
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
	createAccessToken(payload: TJwtOtpPayload): string {
		return this.jwtService.sign(payload, {
			secret: process.env.ACCESS_TOKEN_SECRET,
			expiresIn: "1y",
		});
	}

	/**
	 * Verify JWT access Token
	 * @param {string} token - Client's access Token
	 * @returns {TJwtOtpPayload} - Data object saved in JWT Payload
	 */
	verifyAccessToken(token: string): TJwtOtpPayload {
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

	/**
	 * Create and return JWT email token
	 * @param {TJwtEmailPayload} payload - Data that will be used in token
	 * @returns {string} - JWT token
	 */
	createEmailToken(payload: TJwtEmailPayload): string {
		/** create email token */
		return this.jwtService.sign(payload, {
			secret: process.env.EMAIL_TOKEN_SECRET,
			expiresIn: 60 * 2, // 2 Mins
		});
	}

	/**
	 * Verify JWT email Token
	 * @param {string} token - Client's email Token
	 * @throws {UnauthorizedException} Throws exceptions if the token is invalid or missing.
	 * @returns {TJwtEmailPayload} - Data object saved in JWT Payload
	 */
	verifyEmailToken(token: string): TJwtEmailPayload | never {
		try {
			/** Verify email JWT token */
			const payload = this.jwtService.verify(token, {
				secret: process.env.EMAIL_TOKEN_SECRET,
			});

			/** Throw error in case of invalid payload */
			if (typeof payload !== "object" && !("email" in payload)) {
				throw new BadRequestException(BadRequestMessage.InvalidToken);
			}

			return payload;
		} catch (error) {
			throw new BadRequestException(BadRequestMessage.InvalidToken);
		}
	}

	/**
	 * Create and return JWT phone token
	 * @param {TJwtPhonePayload} payload - Data that will be used in token
	 * @returns {string} - JWT token
	 */
	createPhoneToken(payload: TJwtPhonePayload): string {
		/** create phone token */
		return this.jwtService.sign(payload, {
			secret: process.env.PHONE_TOKEN_SECRET,
			expiresIn: 60 * 2, // 2 Mins
		});
	}

	/**
	 * Verify JWT phone Token
	 * @param {string} token - Client's phone Token
	 * @throws {UnauthorizedException} Throws exceptions if the token is invalid or missing.
	 * @returns {TJwtPhonePayload} - Data object saved in JWT Payload
	 */
	verifyPhoneToken(token: string): TJwtPhonePayload | never {
		try {
			/** Verify phone JWT token */
			const payload = this.jwtService.verify(token, {
				secret: process.env.PHONE_TOKEN_SECRET,
			});

			/** Throw error in case of invalid payload */
			if (typeof payload !== "object" && !("phone" in payload)) {
				throw new BadRequestException(BadRequestMessage.InvalidToken);
			}

			return payload;
		} catch (error) {
			throw new BadRequestException(BadRequestMessage.InvalidToken);
		}
	}
}
