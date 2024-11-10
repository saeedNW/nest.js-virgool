import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { EntityName } from "src/common/enums/entity.enum";
import { TimestampedEntity } from "src/common/abstracts/base.entity";
import { OtpEntity } from "./otp.entity";

@Entity(EntityName.USER)
export class UserEntity extends TimestampedEntity {
	@Column({ unique: true })
	username: string;
	@Column({ unique: true, nullable: true })
	phone: string;
	@Column({ unique: true, nullable: true })
	email: string;
	@Column({ nullable: true })
	password: string;
	@Column({ nullable: true })
	otpId: number;
	@OneToOne(() => OtpEntity, (otp) => otp.user, { nullable: true })
	@JoinColumn()
	otp: OtpEntity;
}
