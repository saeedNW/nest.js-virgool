import { Module } from "@nestjs/common";
import { BlogService } from "./blog.service";
import { BlogController } from "./blog.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlogEntity } from "./entities/blog.entity";
import { BlogLikesEntity } from "./entities/like.entity";
import { BlogBookmarkEntity } from "./entities/bookmark.entity";
import { BlogCommentEntity } from "./entities/comments.entity";
import { AuthModule } from "../auth/auth.module";

@Module({
	imports: [
		AuthModule,
		TypeOrmModule.forFeature([
			BlogEntity,
			BlogLikesEntity,
			BlogBookmarkEntity,
			BlogCommentEntity,
		]),
	],
	controllers: [BlogController],
	providers: [BlogService],
})
export class BlogModule {}
