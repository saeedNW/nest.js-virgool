import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";

export function TypeOrmConfig(): TypeOrmModuleOptions {
	/** retrieve database data from ENVs */
	const { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME } = process.env;

	return {
		type: "postgres",
		port: DB_PORT,
		host: DB_HOST,
		username: DB_USERNAME,
		password: DB_PASSWORD,
		database: DB_NAME,
		autoLoadEntities: true,
		synchronize: process?.env?.NODE_ENV !== "production",
	};
}
