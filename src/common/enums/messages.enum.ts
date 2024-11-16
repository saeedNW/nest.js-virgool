export enum BadRequestMessage {
	InvalidAuthType = "Invalid auth type",
	InvalidAuthMethod = "Invalid auth method",
	NotExpiredOTP = "OTP code is not expire",
	InvalidRegisterMethod = "Register method can't be username",
}

export enum AuthMessage {
	InvalidData = "The entered data is invalid",
	ExpiredCode = "This OTP has been expired",
	AuthorizationFailed = "Authorization filed. log in again.",
	IncorrectCode = "This code is incorrect",
}

export enum NotFoundMessage {
	Category = "This category was not found",
}

export enum ConflictMessage {
	CategoryTitle = "This title is duplicated",
	accountInfo = "Your account has already been registered",
}

export enum ValidationMessage {
	UsernameLength = "Username length should be 3 to 60 characters",
	InvalidAuthType = "Invalid auth type",
	InvalidAuthMethod = "Invalid auth method",
	InvalidEmail = "Invalid email address",
	InvalidPhone = "Invalid phone number",
	OTPLength = "The OTP code should be 5 characters",
	CategoryTitleLength = "title length should be 3 to 20 characters",
	InvalidFileData = "The uploaded file is unacceptable ",
	InvalidFileFormat = "The uploaded file format is unacceptable ",
	TooLargePayload = "The payload is to large",
}

export enum SuccessMessage {
	Default = "Process ended successfully",
	SendOTP = "OTP has been sent successfully",
	Login = "You have logged in to your account successfully",
	CreateCategory = "Category created successfully",
	RemoveCategory = "Category removed successfully",
	UpdateCategory = "Category updated successfully",
}
