import { Module } from "@nestjs/common";
import { BlogService } from "./services/blog.service";
import { BlogController } from "./controllers/blog.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlogEntity } from "./entities/blog.entity";
import { BlogLikesEntity } from "./entities/like.entity";
import { BlogBookmarkEntity } from "./entities/bookmark.entity";
import { BlogCommentEntity } from "./entities/comments.entity";
import { AuthModule } from "../auth/auth.module";
import { BlogCategoryEntity } from "./entities/blog-category.entity";
import { CategoryService } from "../category/category.service";
import { CategoryEntity } from "../category/entities/category.entity";
import { BlogCommentController } from "./controllers/comment.controller";
import { BlogCommentService } from "./services/comment.service";

@Module({
	imports: [
		AuthModule,
		TypeOrmModule.forFeature([
			BlogEntity,
			BlogLikesEntity,
			BlogBookmarkEntity,
			BlogCommentEntity,
			BlogCategoryEntity,
			CategoryEntity,
		]),
	],
	controllers: [BlogController, BlogCommentController],
	providers: [BlogService, CategoryService, BlogCommentService],
})
export class BlogModule {}
