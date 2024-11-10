import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "../user/user.module";

@Module({
	/** Add user module into import in order to cover the dependencies injection */
	imports: [UserModule],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
