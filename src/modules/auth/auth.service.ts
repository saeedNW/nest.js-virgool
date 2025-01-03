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
import {
	AuthMessage,
	BadRequestMessage,
	ConflictMessage,
	SuccessMessage,
	ValidationMessage,
} from "src/common/enums/messages.enum";
import { OtpEntity } from "../user/entities/otp.entity";
import { randomInt } from "crypto";
import { TokenService } from "./tokens.service";
import { Request, Response } from "express";
import { CookieKeys } from "src/common/enums/cookies.enum";
import { TAuthResponse, TGoogleUser } from "./types/response";
import { REQUEST } from "@nestjs/core";
import { tokenCookieOptions } from "src/common/utils/cookie.utils";
import { SmsIrService } from "../http/sms-ir.service";
import { MailtrapEmailService } from "../http/mailtrap-email.service";
import { randomId } from "src/common/utils/functions.utils";
import { ProfileEntity } from "../user/entities/profile.entity";

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
	constructor(
		/** inject user repository */
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,

		/** inject otp repository */
		@InjectRepository(OtpEntity)
		private otpRepository: Repository<OtpEntity>,

		/** inject profile repository */
		@InjectRepository(ProfileEntity)
		private profileRepository: Repository<ProfileEntity>,

		/** make the current request accessible in service  */
		@Inject(REQUEST)
		private request: Request,

		/** Register token service */
		private tokenService: TokenService,

		/** Register sms service */
		private smsIrService: SmsIrService,

		/** Register email service */
		private mailtrapEmailService: MailtrapEmailService
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
				/** Send OTP code to the client's phone or email */
				await this.sendOtp(method, username, result.code);
				/** send response to client */
				return await this.sendResponse(res, result);
			case AuthType.REGISTER:
				/** Handel register process */
				result = await this.register(method, username);
				/** Send OTP code to the client's phone or email */
				await this.sendOtp(method, username, result.code);
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
			throw new ConflictException(ConflictMessage.accountInfo);
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
		res.cookie(CookieKeys.OTP, token, tokenCookieOptions());

		const responseData = {
			message: SuccessMessage.SendOTP,
		};

		/** add token and to response data if project isn't in production */
		if (process.env?.NODE_ENV !== "production") {
			responseData["code"] = code;
			responseData["token"] = token;
		}

		return responseData;
	}

	/**
	 * Send OTP code to clients phone number or email address based on auth method
	 * @param {AuthMethod} method - The method that user used to login [email, phone, username]
	 * @param {string} username - The input data sent by client which can be a username, email or phone
	 * @param {string} code - OTP code
	 */
	async sendOtp(method: AuthMethod, username: string, code: string) {
		/** Send OTP code to user if application was run in production mode */
		if (process.env?.NODE_ENV === "production") {
			if (method === AuthMethod.PHONE) {
				/** Send SMS to client if the authorization method was phone */
				await this.smsIrService.sendVerificationSms(username, code);
			} else if (method === AuthMethod.EMAIL) {
				/** Send EMAIL to client if the authorization method was email */
				await this.mailtrapEmailService.sendVerificationEmail(username, code);
			}
		}
	}

	/**
	 * OTP code verification
	 * @param code - User's OTP code
	 */
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
					verify_phone: true,
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

		return otp;
	}

	/**
	 * Clients' access token validation process
	 * @param {string} token - Access token retrieved from client's request
	 * @throws {UnauthorizedException} - In case of invalid token throw "Unauthorized Exception" error
	 * @returns {Promise<UserEntity | never>} - Returns user's data or throw an error
	 */
	async validateAccessToken(token: string): Promise<UserEntity | never> {
		/** extract user's id from access token */
		const { userId } = this.tokenService.verifyAccessToken(token);

		/** retrieve user's data from database */
		const user = await this.userRepository.findOneBy({ id: userId });

		/** throw error if user was not found */
		if (!user) {
			throw new UnauthorizedException(AuthMessage.AuthorizationFailed);
		}

		/** return user's data */
		return user;
	}

	/**
	 * Handles Google authentication logic.
	 * @param {TGoogleUser} userData - Object containing user details from Google OAuth.
	 */
	async googleAuth(userData: TGoogleUser) {
		/** Destructure user data */
		const { email, firstName, lastName } = userData;

		/** Define a variable to save created token */
		let token: string;

		/** Get user info from database by email */
		let user = await this.userRepository.findOneBy({ email });

		/**
		 * Create access token if user exists in data base or
		 * initialize user creation process if user was not found
		 */
		if (user) {
			/** create access toke */
			token = this.tokenService.createOtpToken({ userId: user.id });
		} else {
			/** Create and instance from user by given data */
			user = this.userRepository.create({
				email,
				verify_email: true,
				username: email.split("@")["0"] + randomId(),
			});

			/** Save user's data to database */
			user = await this.userRepository.save(user);

			/** Create an instance from profile by given data */
			let profile = this.profileRepository.create({
				userId: user.id,
				nickname: `${firstName} ${lastName}`,
			});

			/** Save profile data to database */
			profile = await this.profileRepository.save(profile);

			/** Save profile id to user's data */
			user.profileId = profile.id;
			await this.userRepository.save(user);

			/** Create access token */
			token = this.tokenService.createAccessToken({ userId: user.id });
		}

		return {
			token,
		};
	}
}
