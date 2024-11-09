import {
	CreateDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";

/**
 * Defines base entities to be reused across other entities,
 * reducing code duplication and ensuring consistent structure
 * in each entity file.
 */

/**
 * A base entity that only contains id field
 */
export class BaseEntity {
	@PrimaryGeneratedColumn("increment")
	id: number;
}

/**
 * A base entity that only contains simple basic
 * fields such as id, creation time, update time
 */
export class TimestampedEntity {
	@PrimaryGeneratedColumn("increment")
	id: number;
	@CreateDateColumn()
	created_at: Date;
	@UpdateDateColumn()
	updated_at: Date;
}
