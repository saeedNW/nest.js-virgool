import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { resolve } from "path";
import { TypeOrmConfig } from "src/config/typeorm.config";

@Module({
	imports: [
		/** Load environment variables from the specified .env file through 'ConfigModule' */
		ConfigModule.forRoot({
			envFilePath: resolve(".env"),
			isGlobal: true,
		}),

		/** Load TypeOrm configs and stablish database connection */
		TypeOrmModule.forRoot(TypeOrmConfig()),
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
