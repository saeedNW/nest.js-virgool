export enum BadRequestMessage {
	InvalidAuthType = "Invalid auth type",
	InvalidAuthMethod = "Invalid auth method",
	NotExpiredOTP = "OTP code is not expire",
	InvalidRegisterMethod = "Register method can't be username",
}

export enum AuthMessage {
	InvalidData = "The entered data is invalid",
	DuplicatedEntry = "Your account has already been registered",
}

export enum NotFoundMessage {}

export enum ValidationMessage {
	UsernameLength = "Username length should be 3 to 30 characters",
	InvalidAuthType = "Invalid auth type",
	InvalidAuthMethod = "Invalid auth method",
	InvalidEmail = "Invalid email address",
	InvalidPhone = "Invalid phone number",
}

export enum successMessage {
	Default = "Process ended successfully",
	SendOTP = "OTP has been sent successfully",
}
