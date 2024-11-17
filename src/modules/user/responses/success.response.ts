import { ApiProperty } from "@nestjs/swagger";
import { OkApiBaseResponse } from "src/common/abstracts/base.response";
import { UserEntity } from "../entities/user.entity";

/**
 * Update profile process success response
 */
export class ChangeProfileSuccess extends OkApiBaseResponse {}

/**
 * Get profile process success response
 */
export class GetProfileSuccess extends OkApiBaseResponse {
	@ApiProperty({
		description: "Response data",
		example: {
			id: 4,
			created_at: "2024-11-10T14:04:22.379Z",
			updated_at: "2024-11-16T18:20:28.883Z",
			username: "m_1731260062379",
			phone: "09170000001",
			email: null,
			verify_email: false,
			verify_phone: true,
			password: null,
			otpId: 4,
			profileId: 3,
			profile: {
				id: 3,
				nickname: "SN13",
				bio: "NodeJS backend developper",
				profile_image:
					"/uploads/users/4/profileImage/1731839102916-Screenshot-From-2024-11-16-16-20-09.png",
				profile_bg_image:
					"/uploads/profileImage/1731829444682-Screenshot-From-2024-11-16-16-20-17.png",
				gender: "male",
				birthday: "1996-02-22T12:01:26.487Z",
				linkedin_profile: "sn13",
				userId: 4,
			},
		},
	})
	data: UserEntity;
}