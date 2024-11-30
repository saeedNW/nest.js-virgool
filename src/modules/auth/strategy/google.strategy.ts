import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";

/**
 * Google authentication strategy for handling OAuth2 login with Google.
 */
@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(Strategy, "google") {
	constructor() {
		super({
			/** Define google client credentials information */
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: process.env.SERVER_LINK + "/auth/google/redirect",
			scope: ["email", "profile"],
		});
	}

	/**
	 * Validates the authenticated Google user and returns a user object.
	 * @param {string} accessToken - The access token provided by Google.
	 * @param {string} refreshToken - The refresh token provided by Google (not used here).
	 * @param {any} profile - The user's profile information from Google.
	 * @param {VerifyCallback} done - The callback to pass the user object or error.
	 * @returns A user object with relevant information from the Google profile.
	 */
	async validate(
		accessToken: string,
		refreshToken: string,
		profile: any,
		done: VerifyCallback
	) {
		/** Destructure relevant fields from the Google profile object */
		const { name, emails, photos } = profile;
		const { givenName: firstName, familyName: lastName } = name;
		const [emailData] = emails;
		const [image] = photos;
		/** Create a custom user object to include required details */
		const user = {
			firstName,
			lastName,
			email: emailData?.value,
			profile_image: image?.value,
			accessToken,
		};
		/** Complete the validation process by invoking the callback */
		done(null, user);
	}
}
