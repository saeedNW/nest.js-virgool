import { ParseFilePipe, UploadedFiles, applyDecorators } from "@nestjs/common";

/**
 * A custom decorator for handling optional file uploads in controllers.
 * Combines UploadedFiles with a ParseFilePipe into a custom decorator
 * to make the controller code cleaner and easier to maintain.
 */
export function UploadedOptionalFiles() {
	return UploadedFiles(
		new ParseFilePipe({
			fileIsRequired: false,
			validators: [],
		})
	);
}
