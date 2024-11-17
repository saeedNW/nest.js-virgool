import {
	BadRequestException,
	ConflictException,
	Inject,
	Injectable,
	Scope,
} from "@nestjs/common";
import { ProfileDto } from "./dto/profile.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { Repository } from "typeorm";
import { ProfileEntity } from "./entities/profile.entity";
import { REQUEST } from "@nestjs/core";
import { Request, Response } from "express";
import { isDate } from "class-validator";
import { Gender } from "./enums/gender.enum";
import { TProfileImages } from "./types/files.type";
import { uploadFinalization } from "src/common/utils/multer.utils";
import {
	AuthMessage,
	BadRequestMessage,
	ConflictMessage,
	NotFoundMessage,
	SuccessMessage,
} from "src/common/enums/messages.enum";
import { AuthService } from "../auth/auth.service";
import { TokenService } from "../auth/tokens.service";
import { AuthMethod } from "../auth/enums/method.enum";
import { CookieKeys } from "src/common/enums/cookies.enum";
import { tokenCookieOptions } from "src/common/utils/cookie.utils";
import { OtpEntity } from "./entities/otp.entity";

@Injectable({ scope: Scope.REQUEST })
export class UserService {
	constructor(
		/** Register user repository */
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
		/** Register profile repository */
		@InjectRepository(ProfileEntity)
		private profileRepository: Repository<ProfileEntity>,
		/** Register otp repository */
		@InjectRepository(OtpEntity)
		private otpRepository: Repository<OtpEntity>,
		/** Register current request */
		@Inject(REQUEST) private request: Request,
		/** Register auth service */
		private authService: AuthService,
		/** Register token service */
		private tokenService: TokenService
	) {}

	/**
	 * Service of the process of updating user profile information
	 * @param {TProfileImages} files - Optional uploaded files
	 * @param {ProfileDto} profileDto - Profile data sent by user to be updated
	 */
	async changeProfile(files: TProfileImages, profileDto: ProfileDto) {
		/** Extract user's data from request */
		const { id: userId, profileId } = this.request.user;

		/** Retrieve user's profile data from database */
		let profile = await this.profileRepository.findOneBy({ userId });

		/** Extract birthday and gender from data sent by user */
		const { birthday, gender } = profileDto;

		/** finalize uploaded image upload process */
		for (const [key, file] of Object.entries(files)) {
			profileDto[key] = await uploadFinalization(
				file[0],
				userId,
				"profileImage"
			);
		}

		/** Update profile data if profile exists or create a profile if it doesn't */
		if (profile) {
			/** Merge profileDto fields into the existing profile object */
			Object.assign(profile, {
				...profileDto,
				/** Set birthday if valid date */
				birthday:
					birthday && isDate(new Date(birthday))
						? new Date(birthday)
						: profile.birthday,
				/** Set gender if it matches allowed values */
				gender:
					gender && Object.values(Gender as any).includes(gender)
						? gender
						: profile.gender,
			});
		} else {
			profile = this.profileRepository.create({ ...profileDto, userId });
		}

		/** Save data into database */
		profile = await this.profileRepository.save(profile);

		/** add profile id to user's data  */
		if (!profileId) {
			await this.userRepository.update(
				{ id: userId },
				{ profileId: profile.id }
			);
		}

		return SuccessMessage.Default;
	}

	/**
	 * Service of the process of retrieving user's profile data
	 */
	async getProfile() {
		/** extract user's id from request */
		const { id } = this.request.user;

		/** Retrieve and return user's profile data */
		return this.userRepository.findOne({
			where: { id },
			relations: ["profile"],
		});
	}

	/**
	 * Service of the process of updating user's email address
	 * @param {string} email - user's new email address
	 * @param {Response} response - Client's current response
	 */
	async changeEmail(email: string, response: Response) {
		/** extract user's id from request */
		const { id } = this.request.user;

		/** Retrieve users data by email */
		const user: UserEntity = await this.userRepository.findOneBy({ email });

		/**
		 * Throw error if the email is duplicated and don't belong to the user or
		 * a simple success message if belong to the user
		 */
		if (user && id !== user.id) {
			throw new ConflictException(ConflictMessage.EmailAddress);
		} else if (user && id === user.id) {
			return SuccessMessage.Default;
		}

		/** update user data and save the new email address in the temporary field */
		await this.userRepository.update({ id }, { new_email: email });

		/** Create and save a new OTP code */
		const otp: OtpEntity = await this.authService.saveOtp(id, AuthMethod.EMAIL);

		/** Create a new JWT token for further verification */
		const token: string = this.tokenService.createEmailToken({ email });

		/** Set the token cookie in client's browser */
		response.cookie(CookieKeys.EMAIL, token, tokenCookieOptions());

		const responseData = {
			message: SuccessMessage.SendOTP,
		};

		/** add token and code to response data if project isn't in production */
		if (process.env?.NODE_ENV !== "production") {
			responseData["data"] = { code: otp.code, token };
		}

		return responseData;
	}

	/**
	 * Service of the process of updating user's phone number
	 * @param {string} phone - user's new phone number
	 * @param {Response} response - Client's current response
	 */
	async changePhone(phone: string, response: Response) {
		/** extract user's id from request */
		const { id } = this.request.user;

		/** Retrieve users data by phone */
		const user: UserEntity = await this.userRepository.findOneBy({ phone });

		/**
		 * Throw error if the phone is duplicated and don't belong to the user or
		 * a simple success message if belong to the user
		 */
		if (user && id !== user.id) {
			throw new ConflictException(ConflictMessage.PhoneNumber);
		} else if (user && id === user.id) {
			return SuccessMessage.Default;
		}

		/** update user data and save the new phone number in the temporary field */
		await this.userRepository.update({ id }, { new_phone: phone });

		/** Create and save a new OTP code */
		const otp: OtpEntity = await this.authService.saveOtp(id, AuthMethod.PHONE);

		/** Create a new JWT token for further verification */
		const token: string = this.tokenService.createPhoneToken({ phone });

		/** Set the token cookie in client's browser */
		response.cookie(CookieKeys.PHONE, token, tokenCookieOptions());

		const responseData = {
			message: SuccessMessage.SendOTP,
		};

		/** add token and code to response data if project isn't in production */
		if (process.env?.NODE_ENV !== "production") {
			responseData["data"] = { code: otp.code, token };
		}

		return responseData;
	}

	/**
	 * service of the process of verifying user's email address
	 * @param {string} code - User's email verification code
	 */
	async verifyEmail(code: string) {
		/** extract user's id and new email address from request */
		const { id: userId, new_email }: UserEntity = this.request.user;

		/** extract verification token from client's cookies */
		const token = this.request.signedCookies?.[CookieKeys.EMAIL];

		/** throw error if the token was not found */
		if (!token) throw new BadRequestException(AuthMessage.ExpiredCode);

		/** verify client's token and extract email address from it */
		const { email } = this.tokenService.verifyEmailToken(token);

		/** Throw error if the email address in user's data and the email in token was not same */
		if (email !== new_email) {
			throw new BadRequestException(BadRequestMessage.SomeThingWentWrong);
		}

		/** Validate the verification code sent by user by the one saved in database */
		const otp = await this.checkOtp(userId, code);

		/** throw error if the token method is not related to the email verification process */
		if (otp.method !== AuthMethod.EMAIL) {
			throw new BadRequestException(BadRequestMessage.SomeThingWentWrong);
		}

		/** Update user's data */
		await this.userRepository.update(
			{ id: userId },
			{
				email,
				verify_email: true,
				new_email: null,
			}
		);

		return SuccessMessage.Default;
	}

	/**
	 * Validate the OTP code sent by user with the one saved in database
	 * @param userId - User's id
	 * @param code - the verification code sent by user
	 * @returns {Promise<OtpEntity>} - Return the OPT data
	 */
	async checkOtp(userId: number, code: string): Promise<OtpEntity> {
		/** Retrieve OTP data from database */
		const otp: OtpEntity = await this.otpRepository.findOneBy({ userId });

		/** Throw error if the OTP was not found */
		if (!otp) throw new BadRequestException(NotFoundMessage.OtpCode);

		/** Throw error if the OTP code has expired */
		if (otp.expires_in < new Date())
			throw new BadRequestException(AuthMessage.ExpiredCode);

		/** Throw error if the code is invalid */
		if (otp.code !== code)
			throw new BadRequestException(AuthMessage.IncorrectCode);

		return otp;
	}
}
