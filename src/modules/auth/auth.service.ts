import {
	BadRequestException,
	ConflictException,
	Inject,
	Injectable,
	Scope,
	UnauthorizedException,
	UnprocessableEntityException,
} from "@nestjs/common";
import { AuthDto } from "./dto/auth.dto";
import { AuthType } from "./enums/type.enum";
import { AuthMethod } from "./enums/method.enum";
import { isEmail, isPhoneNumber } from "class-validator";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "../user/entities/user.entity";
import { ProfileEntity } from "../user/entities/profile.entity";
import {
	AuthMessage,
	BadRequestMessage,
	SuccessMessage,
	ValidationMessage,
} from "src/common/enums/messages.enum";
import { OtpEntity } from "../user/entities/otp.entity";
import { randomInt } from "crypto";
import { TokenService } from "./tokens.service";
import { Request, Response } from "express";
import { CookieKeys } from "src/common/enums/cookies.enum";
import { TAuthResponse } from "./types/response";
import { REQUEST } from "@nestjs/core";

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
	constructor(
		/** inject user repository */
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,

		/** inject profile repository */
		@InjectRepository(ProfileEntity)
		private profileRepository: Repository<ProfileEntity>,

		/** inject otp repository */
		@InjectRepository(OtpEntity)
		private otpRepository: Repository<OtpEntity>,

		/** make the current request accessible in service  */
		@Inject(REQUEST)
		private request: Request,

		/** Register token service */
		private tokenService: TokenService
	) {}

	/**
	 * Users' register/login process service
	 * @param {AuthDto} authDto - Data sent by client
	 */
	async userExistence(authDto: AuthDto, res: Response) {
		/** destructure client data */
		const { method, type, username } = authDto;

		/** Declare a variable to save the result of login/register processes */
		let result: TAuthResponse;

		/** proceed based on user's request type [Login, Register] */
		switch (type) {
			case AuthType.LOGIN:
				/** Handel login process */
				result = await this.login(method, username);
				/** send response to client */
				return await this.sendResponse(res, result);
			case AuthType.REGISTER:
				/** Handel register process */
				result = await this.register(method, username);
				/** send response to client */
				return this.sendResponse(res, result);
			default:
				throw new BadRequestException(BadRequestMessage.InvalidAuthType);
		}
	}

	/**
	 * users' login process manager service
	 * @param {AuthMethod} method - The method that user used to login [email, phone, username]
	 * @param {string} username - The input data sent by client which can be a username, email or phone
	 */
	async login(method: AuthMethod, username: string) {
		/** Validate user's username  */
		const validUsername: string = this.usernameValidator(method, username);

		/** retrieve user's data from database */
		const user: UserEntity = await this.getUser(validUsername);

		/** throw error if user was not found */
		if (!user) {
			throw new UnauthorizedException(AuthMessage.InvalidData);
		}

		/** create OTP data */
		const otp: OtpEntity = await this.saveOtp(user.id, method);

		/** Generate user's otp token */
		const token = this.tokenService.createOtpToken({ userId: user.id });

		return {
			token,
			code: otp.code,
		};
	}

	/**
	 * users' register process manager service
	 * @param {AuthMethod} method - The method that user used to login [email, phone, username]
	 * @param {string} username - The input data sent by client which can be a username, email or phone
	 */
	async register(method: AuthMethod, username: string) {
		/** Validate user's username  */
		const validUsername: string = this.usernameValidator(method, username);

		/** throw error if register method is username */
		if (method === AuthMethod.USERNAME) {
			throw new BadRequestException(BadRequestMessage.InvalidRegisterMethod);
		}

		/** retrieve user's data from database */
		let user: UserEntity = await this.getUser(validUsername);

		/** throw error if user was duplicated */
		if (user) {
			throw new ConflictException(AuthMessage.DuplicatedEntry);
		}

		/** create new user's data */
		user = this.userRepository.create({
			[method]: username,
			username: `m_${Date.now()}`,
		});

		/** save user's data in database */
		user = await this.userRepository.save(user);

		/** create OTP data */
		const otp: OtpEntity = await this.saveOtp(user.id, method);

		/** Generate user's otp token */
		const token = this.tokenService.createOtpToken({ userId: user.id });

		return {
			token,
			code: otp.code,
		};
	}

	/**
	 * Send authorization process response to client
	 * @param {Response} res - Express response object
	 * @param {TAuthResponse} result - Login/register process result
	 */
	async sendResponse(res: Response, result: TAuthResponse) {
		/** extract data from authentication process result */
		const { token, code } = result;
		/** Set a cookie in user browser ti be used in future auth processes */
		res.cookie(CookieKeys.OTP, token, {
			httpOnly: true,
			signed: true,
			expires: new Date(Date.now() + 1000 * 60 * 2), // 2 Mins
		});

		const responseData = {
			status: 201,
			success: true,
			message: SuccessMessage.SendOTP,
		};

		/** add token and to response data if project isn't in production */
		if (process.env?.NODE_ENV !== "production") {
			responseData["data"] = { code, token };
		}

		return res.json(responseData);
	}

	async checkOtp(code: string) {
		/** Extract client's otp token from current request */
		const token: string | undefined =
			this.request.signedCookies?.[CookieKeys.OTP];

		/** throw error if token was undefined */
		if (!token) {
			throw new UnauthorizedException(AuthMessage.ExpiredCode);
		}

		const { userId } = this.tokenService.verifyOtpToken(token);

		const otp = await this.otpRepository.findOneBy({ userId });

		if (!otp) throw new UnauthorizedException(AuthMessage.AuthorizationFailed);

		const now = new Date();

		if (otp.expires_in < now) {
			throw new UnauthorizedException(AuthMessage.AuthorizationFailed);
		}

		if (otp.code !== code) {
			throw new UnauthorizedException(AuthMessage.IncorrectCode);
		}

		/** create client's access token */
		const accessToken = this.tokenService.createAccessToken({ userId });

		/** update user's phone/email verification based on authorization and OTP method */
		if (otp.method === AuthMethod.EMAIL) {
			await this.userRepository.update(
				{ id: userId },
				{
					verify_email: true,
				}
			);
		} else if (otp.method === AuthMethod.PHONE) {
			await this.userRepository.update(
				{ id: userId },
				{
					verify_email: true,
				}
			);
		}
		
		return {
			message: SuccessMessage.Login,
			accessToken,
		};
	}

	/**
	 * Validate Client's username filed based on the chosen method
	 * @param {AuthMethod} method - The login/register method chosen by client [email, username, phone]
	 * @param {string} username - The username value sent by client
	 * @returns {string | never} Return the username value after validation or throw error in case of invalid username
	 */
	usernameValidator(method: AuthMethod, username: string): string | never {
		/** proceed validation based on request method */
		switch (method) {
			case AuthMethod.EMAIL: // Validate email address
				if (isEmail(username)) return username;
				throw new UnprocessableEntityException(ValidationMessage.InvalidEmail);
			case AuthMethod.PHONE: // Validate phone number
				if (isPhoneNumber(username, "IR")) return username;
				throw new UnprocessableEntityException(ValidationMessage.InvalidPhone);
			case AuthMethod.USERNAME:
				return username;
			default:
				throw new BadRequestException(BadRequestMessage.InvalidAuthMethod);
		}
	}

	/**
	 * Retrieve and return user's data based on the given username
	 * @param {string} username The input data sent by client which can be username, email or phone number
	 * @returns {Promise<UserEntity> | null} Return the retrieved user from database
	 */
	async getUser(username: string): Promise<UserEntity> | null {
		/**
		 * retrieve user's data based on the give data by client.
		 * Using [] in a TypeOrm where method works as an OR command,
		 * which in this case will retrieve any user that has a matching
		 * value with one of the methods data [username, email, phone]
		 */
		return await this.userRepository.findOne({
			where: [{ username: username }, { email: username }, { phone: username }],
		});
	}

	/**
	 * Create new OTP code and save it in database if needed
	 * @param {number} userId - User's data id
	 * @returns {Promise<OtpEntity>} - returns OTP data
	 */
	async saveOtp(userId: number, method: AuthMethod): Promise<OtpEntity> {
		/** create a random 5 digit number */
		const code: string = randomInt(10000, 99999).toString();
		/** set the expires time of the OTP for 2 min */
		const expires_in = new Date(Date.now() + 1000 * 60 * 2);

		/** check if user already has an otp or not */
		let otp: OtpEntity = await this.otpRepository.findOneBy({ userId });

		/**
		 * Define a boolean to be used in case of new OTP
		 * creation to save the OTP id in user's data
		 */
		let newOtp: boolean = true;

		if (otp) {
			newOtp = false;

			/** throw error if OTP not expired */
			if (otp.expires_in > new Date()) {
				throw new BadRequestException(BadRequestMessage.NotExpiredOTP);
			}

			/** update otp data */
			otp.code = code;
			otp.expires_in = expires_in;
			otp.method = method;
		} else {
			/** create new otp */
			otp = this.otpRepository.create({ code, expires_in, userId, method });
		}

		/** save otp data */
		otp = await this.otpRepository.save(otp);

		/** update user's otp data in case if the OTP is newly created */
		if (newOtp) {
			await this.userRepository.update({ id: userId }, { otpId: otp.id });
		}

		// TODO: Send OTP code through SMS / Email

		return otp;
	}
}
