import { ConflictException, Inject, Injectable, Scope } from "@nestjs/common";
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
	ConflictMessage,
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
	 * @param email - user's new email address
	 * @param response - Client's current response
	 */
	async changeEmail(email: string, response: Response) {
		/** extract user's id from request */
		const { id } = this.request.user;

		/** Retrieve users data by id */
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
}
