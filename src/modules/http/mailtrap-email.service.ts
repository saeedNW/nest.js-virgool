import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class MailtrapEmailService {
	constructor(
		/** Register mailer service */
		private readonly mailerService: MailerService
	) {}

	/**
	 * Send email verification code to user
	 * @param to - user's email address
	 * @param code - User's verification code
	 */
	async sendVerificationEmail(to: string, code: string): Promise<void> {
		try {
			const result = await this.mailerService.sendMail({
				to,
				subject: "OTP verification code",
				html:
					"<p>Your verification code: <b style='color:blue;'>" +
					code +
					"</b></p>",
			});

			console.log(result);
		} catch (error) {
			/** Catch and throw errors */
			throw new InternalServerErrorException(
				"MAILTRAP: " + error.response?.data?.message || error.message
			);
		}
	}
}
