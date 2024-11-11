/**
 * Extend the 'ProcessEnv' interface in the NodeJS namespace to create
 * globally accessible types for environment variables.
 *
 * Adding types here provides type suggestions when accessing variables
 * through 'process.env'.
 */

namespace NodeJS {
	interface ProcessEnv {
		/** Application configuration */
		PORT: number; // Port number for the application
		NODE_ENV: string; // Application runtime environment

		/** Database configuration */
		DB_PORT: number; // Database server port
		DB_NAME: string; // Name of the database
		DB_USERNAME: string; // Database username
		DB_PASSWORD: string; // Database password
		DB_HOST: string; // Database host address

		/** Secrets */
		COOKIE_SECRET: string; // Cookie parser secret
		OTP_TOKEN_SECRET: string; // JWT OTP token secret
	}
}
