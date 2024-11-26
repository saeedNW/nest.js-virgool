import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { Column, Entity, ManyToOne } from "typeorm";
import { BlogEntity } from "./blog.entity";
import { CategoryEntity } from "src/modules/category/entities/category.entity";

@Entity(EntityName.BLOG_CATEGORY)
export class BlogCategoryEntity extends BaseEntity {
	@Column()
	blogId: number;
	@ManyToOne(() => BlogEntity, (blog) => blog.categories, {
		onDelete: "CASCADE",
	})
	blog: BlogEntity;
	@Column()
	categoryId: number;
	@ManyToOne(() => CategoryEntity, (category) => category.blog_categories, {
		onDelete: "CASCADE",
	})
	category: CategoryEntity;
}
