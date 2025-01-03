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
		SERVER_LINK: string; // Application's Server URL address
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
		ACCESS_TOKEN_SECRET: string; // JWT access token secret
		EMAIL_TOKEN_SECRET: string; // JWT email token secret
		PHONE_TOKEN_SECRET: string; // JWT email token secret

		/** SMS.ir */
		SMS_IR_API_KEY: string;
		SMS_IR_SEND_URL: string;

		/** Email SMTP info (mailtrap) */
		EMAIL_HOST: string;
		EMAIL_USERNAME: string;
		EMAIL_PASSWORD: string;

		/** Google OAuth client */
		GOOGLE_CLIENT_ID: string;
		GOOGLE_CLIENT_SECRET: string;
	}
}
