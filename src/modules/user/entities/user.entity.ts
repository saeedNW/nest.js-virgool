import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { EntityName } from "src/common/enums/entity.enum";
import { TimestampedEntity } from "src/common/abstracts/base.entity";
import { OtpEntity } from "./otp.entity";
import { ProfileEntity } from "./profile.entity";
import { BlogEntity } from "src/modules/blog/entities/blog.entity";
import { BlogLikesEntity } from "src/modules/blog/entities/like.entity";
import { BlogBookmarkEntity } from "src/modules/blog/entities/bookmark.entity";
import { BlogCommentEntity } from "src/modules/blog/entities/comments.entity";

@Entity(EntityName.USER)
export class UserEntity extends TimestampedEntity {
	@Column({ unique: true })
	username: string;
	@Column({ unique: true, nullable: true })
	phone: string;
	@Column({ unique: true, nullable: true })
	email: string;
	@Column({ nullable: true })
	new_email: string;
	@Column({ nullable: true })
	new_phone: string;
	@Column({ nullable: true, default: false })
	verify_email: boolean;
	@Column({ nullable: true, default: false })
	verify_phone: boolean;
	@Column({ nullable: true })
	password: string;
	@Column({ nullable: true })
	otpId: number;
	@OneToOne(() => OtpEntity, (otp) => otp.user, { nullable: true })
	@JoinColumn()
	otp: OtpEntity;
	@Column({ nullable: true })
	profileId: number;
	@OneToOne(() => ProfileEntity, (profile) => profile.user, { nullable: true })
	@JoinColumn()
	profile: ProfileEntity;
	@OneToMany(() => BlogEntity, (blog) => blog.author)
	blogs: BlogEntity[];
	@OneToMany(() => BlogLikesEntity, (like) => like.user)
	blog_likes: BlogLikesEntity[];
	@OneToMany(() => BlogBookmarkEntity, (bookmark) => bookmark.user)
	blog_bookmarks: BlogBookmarkEntity[];
	@OneToMany(() => BlogCommentEntity, (comment) => comment.user)
	blog_comments: BlogCommentEntity[];
}
