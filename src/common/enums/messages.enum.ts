export enum BadRequestMessage {
	InvalidAuthType = "Invalid auth type",
	InvalidAuthMethod = "Invalid auth method",
	NotExpiredOTP = "OTP code is not expire",
	InvalidRegisterMethod = "Register method can't be username",
	InvalidToken = "The verification token is invalid",
	SomeThingWentWrong = "Some thing went wrong, please retry",
	AlreadyAcceptedComment = "This comment has already been accepted",
	AlreadyRejectedComment = "This comment has already been rejected",
}

export enum AuthMessage {
	InvalidData = "The entered data is invalid",
	ExpiredCode = "This OTP has been expired",
	AuthorizationFailed = "Authorization filed. log in again.",
	IncorrectCode = "This code is incorrect",
}

export enum NotFoundMessage {
	Image = "This image was not found",
	Blog = "This blog was not found",
	Comment = "This comment was not found",
	Category = "This category was not found",
	OtpCode = "No otp code for this request has been found",
}

export enum ConflictMessage {
	CategoryTitle = "This title is duplicated",
	accountInfo = "Your account has already been registered",
	EmailAddress = "Duplicated email address",
	PhoneNumber = "Duplicated phone number",
	Username = "Duplicated username",
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
