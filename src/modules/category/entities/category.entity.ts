import { TimestampedEntity } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { BlogCategoryEntity } from "src/modules/blog/entities/blog-category.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity(EntityName.CATEGORY)
export class CategoryEntity extends TimestampedEntity {
	@Column()
	title: string;
	@Column({ nullable: true })
	priority: number;
	@OneToMany(() => BlogCategoryEntity, (blog) => blog.category)
	blog_categories: BlogCategoryEntity[];
}
