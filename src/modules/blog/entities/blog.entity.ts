import { TimestampedEntity } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BlogStatus } from "../enums/status.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { BlogLikesEntity } from "./like.entity";
import { BlogBookmarkEntity } from "./bookmark.entity";
import { BlogCommentEntity } from "./comments.entity";

@Entity(EntityName.BLOG)
export class BlogEntity extends TimestampedEntity {
	@Column()
	title: string;
	@Column()
	description: string;
	@Column()
	content: string;
	@Column({ nullable: true })
	image: string;
	@Column({ default: BlogStatus.DRAFT })
	status: string;
	@Column()
	authorId: number;
	@ManyToOne(() => UserEntity, (user) => user.blogs, { onDelete: "CASCADE" })
	author: UserEntity;
	@OneToMany(() => BlogLikesEntity, (like) => like.blog)
	likes: BlogLikesEntity[];
	@OneToMany(() => BlogBookmarkEntity, (bookmark) => bookmark.blog)
	bookmarks: BlogBookmarkEntity[];
	@OneToMany(() => BlogCommentEntity, (comment) => comment.blog)
	comments: BlogCommentEntity[];

	// @Column({ unique: true })
	// slug: string;
	// @Column()
	// time_for_study: string;
	// @OneToMany(() => BlogCategoryEntity, (category) => category.blog)
	// categories: BlogCategoryEntity[];
}
