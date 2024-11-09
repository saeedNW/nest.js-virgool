import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { Column, Entity } from "typeorm";

@Entity(EntityName.PROFILE)
export class ProfileEntity extends BaseEntity {
	@Column()
	nickname: string;
	@Column({ nullable: true })
	bio: string;
	@Column({ nullable: true })
	profile_image: string;
	@Column({ nullable: true })
	profile_bg_image: string;
	@Column({ nullable: true })
	gender: string;
	@Column({ nullable: true })
	birthday: Date;
	@Column({ nullable: true })
	linkedin_profile: string;
}
