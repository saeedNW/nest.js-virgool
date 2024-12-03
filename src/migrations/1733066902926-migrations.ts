import { EntityName } from "src/common/enums/entity.enum";
import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableColumn,
	TableForeignKey,
} from "typeorm";

export class Migrations1733066902926 implements MigrationInterface {
	/**
	 * Migration run process
	 */
	public async up(queryRunner: QueryRunner): Promise<void> {
		/**
		 * ? Migration to create user table
		 */
		await queryRunner.createTable(
			new Table({
				name: EntityName.USER,
				columns: [
					{
						name: "id",
						isPrimary: true,
						type: "serial",
						isNullable: false,
					},
					{
						name: "username",
						type: "character varying(50)",
						isNullable: true,
						isUnique: true,
					},
					{
						name: "phone",
						type: "character varying(12)",
						isNullable: true,
						isUnique: true,
					},
					{
						name: "email",
						type: "character varying(100)",
						isNullable: true,
						isUnique: true,
					},
					{
						name: "new_email",
						type: "varchar",
						isNullable: true,
					},
					{
						name: "new_phone",
						type: "varchar",
						isNullable: true,
					},
					{
						name: "verify_email",
						type: "boolean",
						isNullable: true,
						default: false,
					},
					{
						name: "verify_phone",
						type: "boolean",
						isNullable: true,
						default: false,
					},
					{
						name: "password",
						type: "varchar(50)",
						isNullable: true,
					},
					{
						name: "otpId",
						type: "int",
						isUnique: true,
						isNullable: true,
					},
					{
						name: "profileId",
						type: "int",
						isUnique: true,
						isNullable: true,
					},
					{
						name: "created_at",
						type: "timestamp",
						default: "now()",
					},
					{
						name: "updated_at",
						type: "timestamp",
						default: "now()",
					},
				],
			}),
			true
		);

		/**
		 * ? Migration to create profile table
		 */
		await queryRunner.createTable(
			new Table({
				name: EntityName.PROFILE,
				columns: [
					{
						name: "id",
						type: "int",
						isPrimary: true,
						isGenerated: true,
						generationStrategy: "increment",
					},
					{ name: "nickname", type: "varchar(50)", isNullable: true },
					{ name: "bio", type: "varchar", isNullable: true },
					{ name: "profile_image", type: "varchar", isNullable: true },
					{ name: "profile_bg_image", type: "varchar", isNullable: true },
					{ name: "gender", type: "varchar(10)", isNullable: true },
					{ name: "birthday", type: "timestamp", isNullable: true },
					{ name: "linkedin_profile", type: "varchar", isNullable: true },
					{ name: "userId", type: "int", isNullable: false, isUnique: true },
				],
			}),
			true
		);

		/**
		 * ? Migration to initialize the relation between profile and user tables
		 */
		await queryRunner.createForeignKey(
			EntityName.PROFILE,
			new TableForeignKey({
				columnNames: ["userId"],
				referencedColumnNames: ["id"],
				referencedTableName: EntityName.USER,
				onDelete: "CASCADE",
			})
		);

		/**
		 * ? Migration to initialize the relation between user and profile tables
		 */
		await queryRunner.createForeignKey(
			EntityName.USER,
			new TableForeignKey({
				columnNames: ["profileId"],
				referencedColumnNames: ["id"],
				referencedTableName: EntityName.PROFILE,
			})
		);

		/**
		 * ? Migration to create OTP table
		 */
		await queryRunner.createTable(
			new Table({
				name: EntityName.OTP,
				columns: [
					{
						name: "id",
						type: "int",
						isPrimary: true,
						isGenerated: true,
						generationStrategy: "increment",
					},
					{ name: "code", type: "varchar(6)", isNullable: false },
					{ name: "expires_in", type: "timestamp", isNullable: false },
					{ name: "method", type: "varchar(10)", isNullable: true },
					{ name: "userId", type: "int", isNullable: false, isUnique: true },
				],
			}),
			true
		);

		/**
		 * ? Migration to initialize the relation between OTP and user tables
		 */
		await queryRunner.createForeignKey(
			EntityName.OTP,
			new TableForeignKey({
				columnNames: ["userId"],
				referencedColumnNames: ["id"],
				referencedTableName: EntityName.USER,
				onDelete: "CASCADE",
			})
		);

		/**
		 * ? Migration to initialize the relation between user and OTP tables
		 */
		await queryRunner.createForeignKey(
			EntityName.USER,
			new TableForeignKey({
				columnNames: ["otpId"],
				referencedColumnNames: ["id"],
				referencedTableName: EntityName.OTP,
			})
		);

		/**
		 * ? Migration to add a new column to user table
		 */
		// const role = await queryRunner.hasColumn(EntityName.USER, "role");
		// if (!role) {
		// 	//@ts-ignore
		// 	await queryRunner.addColumn(EntityName.USER, {
		// 		name: "role",
		// 		type: "character varying(10)",
		// 		default: "USER",
		// 	});
		// }

		/**
		 * ? Migration to change username column properties using changeColumn method (NOT RECOMMENDED)
		 * ! DATA LOST WARNING: Don't use this option on a production database
		 * ! Using `changeColumn` and `new TableColumn` will result in data lost on the updated column
		 * ! Instead of using this option, You should use `pure SQL queries` such as `ALTER TABLE`
		 * ! you can find an example of ALTER TABLE after this option
		 */
		// const username = await queryRunner.hasColumn(EntityName.USER, "username");
		// if (username) {
		// 	//@ts-ignore
		// 	await queryRunner.changeColumn(
		// 		EntityName.USER,
		// 		"username",
		// 		new TableColumn({
		// 			type: "varchar(50)",
		// 			name: "username",
		// 			isNullable: true,
		// 			isUnique: true,
		// 		})
		// 	);
		// }

		/**
		 * ? Migration to change username column properties using pure SQL (RECOMMENDED)
		 */
		// await queryRunner.query(
			// `ALTER TABLE "user" ALTER COLUMN "username" SET NOT NULL`
		// );

		/**
		 * ? Migration to change phone column name to mobile using pure SQL
		 */
		// await queryRunner.query(
		// 	`ALTER TABLE "user" RENAME COLUMN "phone" TO "mobile"`
		// );
	}

	/**
	 * Migration revert process
	 */
	public async down(queryRunner: QueryRunner): Promise<void> {
		/**
		 * ? Remove profile's user foreignKey
		 */
		const profile = await queryRunner.getTable(EntityName.PROFILE);
		if (profile) {
			const userFk = profile.foreignKeys.find(
				(fk) => fk.columnNames.indexOf("userId") !== -1
			);
			if (userFk) await queryRunner.dropForeignKey(EntityName.PROFILE, userFk);
		}

		/**
		 * ? Remove OTP's user foreignKey
		 */
		const otp = await queryRunner.getTable(EntityName.OTP);
		if (otp) {
			const userFk = otp.foreignKeys.find(
				(fk) => fk.columnNames.indexOf("userId") !== -1
			);
			if (userFk) await queryRunner.dropForeignKey(EntityName.OTP, userFk);
		}

		/**
		 * ? Remove user's profile and OTP foreignKeys
		 */
		const user = await queryRunner.getTable(EntityName.USER);
		if (user) {
			const profileFk = user.foreignKeys.find(
				(fk) => fk.columnNames.indexOf("profileId") !== -1
			);
			if (profileFk)
				await queryRunner.dropForeignKey(EntityName.USER, profileFk);

			const otpFk = user.foreignKeys.find(
				(fk) => fk.columnNames.indexOf("otpId") !== -1
			);
			if (otpFk) await queryRunner.dropForeignKey(EntityName.USER, otpFk);
		}

		await queryRunner.dropTable(EntityName.PROFILE, true);
		await queryRunner.dropTable(EntityName.OTP, true);
		await queryRunner.dropTable(EntityName.USER, true);
	}
}
