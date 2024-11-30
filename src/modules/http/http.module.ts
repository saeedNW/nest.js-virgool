import { HttpModule } from "@nestjs/axios";
import { Global, Module } from "@nestjs/common";
import { SmsIrService } from "./sms-ir.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { MailtrapEmailService } from "./mailtrap-email.service";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Global()
@Module({
	imports: [
		/** Register timeout for requested come to the module */
		HttpModule.register({
			timeout: 10000,
		}),
		/** Register mailer module system */
		MailerModule.forRootAsync({
			/** Import ConfigModule explicitly */
			imports: [ConfigModule],
			/** Inject ConfigService */
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				transport: {
					/** Access MAILTRAP_HOST env variable */
					host: configService.get<string>("MAILTRAP_HOST"),
					port: 2525,
					auth: {
						/** Access MAILTRAP_USER env variable */
						user: configService.get<string>("MAILTRAP_USER"),
						/** Access MAILTRAP_PASS env variable */
						pass: configService.get<string>("MAILTRAP_PASS"),
					},
				},
				defaults: {
					from: '"No Reply" <no-reply@example.com>',
				},
			}),
		}),
	],
	providers: [SmsIrService, MailtrapEmailService],
	exports: [SmsIrService, MailtrapEmailService],
})
export class CustomHttpModule {}
