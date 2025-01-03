import { config } from "dotenv";
import { join } from "path";
import { DataSource } from "typeorm";
config();
config({ path: join(process.cwd(), ".env") });

/** Destructure database configuration variables from the environment */
const { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME } = process.env;

/**
 * Creates and exports a TypeORM DataSource object for connecting to a PostgreSQL database.
 */
let dataSource = new DataSource({
	type: "postgres",
	host: DB_HOST,
	password: DB_PASSWORD,
	username: DB_USERNAME,
	database: DB_NAME,
	port: +DB_PORT,
	synchronize: false,
	entities: ["dist/**/**/**/*.entity{.ts,.js}", "dist/**/**/*.entity{.ts,.js}"],
	migrations: ["dist/migrations/*{.ts,.js}"],
	migrationsTableName: "virgool_migration_db",
});

export default dataSource;
