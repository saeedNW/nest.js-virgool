import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
} from "typeorm";
import { BlogEntity } from "./blog.entity";

@Entity(EntityName.BLOG_COMMENTS)
export class BlogCommentEntity extends BaseEntity {
	@Column()
	text: string;
	@Column({ default: true })
	accepted: boolean;
	@Column()
	blogId: number;
	@Column()
	userId: number;
	@ManyToOne(() => BlogEntity, (blog) => blog.comments, { onDelete: "CASCADE" })
	blog: BlogEntity;
	@Column({ nullable: true })
	parentId: number;
	@ManyToOne(() => BlogCommentEntity, (parent) => parent.children, {
		onDelete: "CASCADE",
	})
	parent: BlogCommentEntity;
	@OneToMany(() => BlogCommentEntity, (comment) => comment.parent)
	@JoinColumn({ name: "parent" })
	children: BlogCommentEntity[];
	@ManyToOne(() => UserEntity, (user) => user.blog_comments, {
		onDelete: "CASCADE",
	})
	user: UserEntity;
	@CreateDateColumn()
	created_at: Date;
}
