import { Inject, Injectable, Scope } from "@nestjs/common";
import { ProfileDto } from "./dto/profile.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { Repository } from "typeorm";
import { ProfileEntity } from "./entities/profile.entity";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { isDate } from "class-validator";
import { Gender } from "./enums/gender.enum";
import { TProfileImages } from "./types/files.type";
import { uploadFinalization } from "src/common/utils/multer.utils";
import { SuccessMessage } from "src/common/enums/messages.enum";

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
		@Inject(REQUEST) private request: Request
	) {}

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

	async getProfile() {
		const { id } = this.request.user;

		return this.userRepository.findOne({
			where: { id },
			relations: ["profile"],
		});
	}
}
