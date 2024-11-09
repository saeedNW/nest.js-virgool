import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { resolve } from "path";

@Module({
	imports: [
		/** Load environment variables from the specified .env file through 'ConfigModule' */
		ConfigModule.forRoot({
			envFilePath: resolve(".env"),
			isGlobal: true,
		}),
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
