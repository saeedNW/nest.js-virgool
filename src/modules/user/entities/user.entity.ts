import { Column, Entity } from "typeorm";
import { EntityName } from "src/common/enums/entity.enum";
import { TimestampedEntity } from "src/common/abstracts/base.entity";

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
}
