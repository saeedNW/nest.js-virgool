export enum BadRequestMessage {
	InvalidAuthType = "Invalid auth type",
	InvalidAuthMethod = "Invalid auth method",
	NotExpiredOTP = "OTP code is not expire",
	InvalidRegisterMethod = "Register method can't be username",
}

export enum AuthMessage {
	InvalidData = "The entered data is invalid",
	DuplicatedEntry = "Your account has already been registered",
	ExpiredCode = "This OTP has been expired",
	AuthorizationFailed = "Authorization filed. log in again.",
	IncorrectCode = "This code is incorrect",
}

export enum NotFoundMessage {}

export enum ValidationMessage {
	UsernameLength = "Username length should be 3 to 60 characters",
	InvalidAuthType = "Invalid auth type",
	InvalidAuthMethod = "Invalid auth method",
	InvalidEmail = "Invalid email address",
	InvalidPhone = "Invalid phone number",
	OTPLength = "The OTP code should be 5 characters",
}

export enum SuccessMessage {
	Default = "Process ended successfully",
	SendOTP = "OTP has been sent successfully",
	Login = "You have logged in to your account successfully",
}
