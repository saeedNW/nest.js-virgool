import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { resolve } from "path";
import { TypeOrmConfig } from "src/config/typeorm.config";
import { UserModule } from "../user/user.module";
import { AuthModule } from "../auth/auth.module";
import { CategoryModule } from "../category/category.module";
import { BlogModule } from "../blog/blog.module";
import { ImageModule } from "../image/image.module";
import { CustomHttpModule } from "../http/http.module";

@Module({
	imports: [
		/** Load environment variables from the specified .env file through 'ConfigModule' */
		ConfigModule.forRoot({
			envFilePath: resolve(".env"),
			isGlobal: true,
		}),

		/** Load TypeOrm configs and stablish database connection */
		TypeOrmModule.forRoot(TypeOrmConfig()),

		/** Load modules */
		AuthModule,
		UserModule,
		CategoryModule,
		BlogModule,
		ImageModule,
		CustomHttpModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
