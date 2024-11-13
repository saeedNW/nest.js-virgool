import { TimestampedEntity } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { Column, Entity } from "typeorm";

@Entity(EntityName.CATEGORY)
export class CategoryEntity extends TimestampedEntity {
	@Column()
	title: string;
	@Column({ nullable: true })
	priority: number;
}
