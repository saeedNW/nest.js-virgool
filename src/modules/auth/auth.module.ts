import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtService } from "@nestjs/jwt";
import { TokenService } from "./tokens.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../user/entities/user.entity";
import { OtpEntity } from "../user/entities/otp.entity";
import { ProfileEntity } from "../user/entities/profile.entity";
import { GoogleAuthStrategy } from "./strategy/google.strategy";
import { GoogleAuthController } from "./google.controller";

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity, OtpEntity, ProfileEntity])],
	controllers: [AuthController, GoogleAuthController],
	providers: [AuthService, JwtService, TokenService, GoogleAuthStrategy],
	exports: [
		AuthService,
		JwtService,
		TokenService,
		TypeOrmModule,
		GoogleAuthStrategy,
	],
})
export class AuthModule {}
