import { Request } from "express";
import { basename, extname, resolve } from "path";
import { UnprocessableEntityException } from "@nestjs/common";
import { diskStorage, Options } from "multer";
import { existsSync, mkdirSync, unlinkSync } from "fs";
import { rename } from "fs/promises";
import { ValidationMessage } from "../enums/messages.enum";

/** Define a Type for multer's destination manager function's callback */
export type TCallbackDestination = (error: Error, destination: string) => void;
/** Define a Type for multer's file name manager function's callback */
export type TCallbackFilename = (error: Error, filename: string) => void;
/** Define a Type for multer destination manager function's callback */
export type TCallbackValidator = (error: Error, status: null | boolean) => void;
/** Define a Type for uploaded file */
export type TMulterFile = Express.Multer.File;

/**
 * A function which will create and manage multer's uploaded
 * file temporary destination
 * @returns Return a callback used by multer for setting the destination
 */
function multerDestination() {
	/**
	 * @param {Request} req - The incoming HTTP request object
	 * @param {TMulterFile} file - The file metadata provided by multer
	 * @param {TCallbackDestination} cb - The callback function to pass the result to multer
	 */
	return function (
		req: Request,
		file: TMulterFile,
		cb: TCallbackDestination
	): void {
		/** Throw error if the uploaded file was invalid */
		if (!file?.originalname) {
			return cb(
				new UnprocessableEntityException(ValidationMessage.InvalidFileData),
				null
			);
		}

		/** Define the upload path for storing files temporarily */
		const uploadPath: string = resolve("./public/uploads/temp");

		/** Ensure the directory exists, creating it if necessary */
		mkdirSync(uploadPath, { recursive: true });

		return cb(null, uploadPath);
	};
}

/**
 * Generates a unique filename for uploaded files
 * @param {Request} req - The incoming HTTP request object
 * @param {TMulterFile} file - The file metadata provided by multer
 * @param {TCallbackFilename} cb - The callback function to pass the generated filename to multer.
 */
function multerFilename(
	req: Request,
	file: TMulterFile,
	cb: TCallbackFilename
): void {
	/** Throw error if the uploaded file was invalid */
	if (!file?.originalname) {
		return cb(
			new UnprocessableEntityException(ValidationMessage.InvalidFileData),
			null
		);
	}

	/** Extract the file extension and convert it to lowercase */
	const ext: string = extname(file?.originalname || "").toLowerCase();

	/** Extract the base name of the file and replace spaces with hyphens */
	const originalName: string = basename(
		file?.originalname || "",
		extname(file?.originalname || "")
	).replace(/\s/g, "-");

	/** Generate a unique temporary name for the uploaded file */
	const fileTempName: string = String(Date.now() + originalName + ext);

	return cb(null, fileTempName);
}

/**
 * Validates the format of the uploaded file by checking its extension.
 * @param {Request} req - The incoming HTTP request object
 * @param {TMulterFile} file - The file metadata provided by multer
 * @param {TCallbackValidator} cb - The callback function to pass the validation result to multer.
 */
function imageFormatFilter(
	req: Request,
	file: TMulterFile,
	cb: TCallbackValidator
): void {
	/** Extract the file extension and convert it to lowercase */
	const ext: string = extname(file?.originalname || "").toLowerCase();

	/** Define the valid file extensions */
	const validMimeTypes: string[] = [".jpg", ".png", ".jpeg"];

	/** Throw error if file type in not allowed */
	if (!validMimeTypes.includes(ext)) {
		return cb(
			new UnprocessableEntityException(ValidationMessage.InvalidFileFormat),
			null
		);
	}

	return cb(null, true);
}

/**
 * Converts an absolute URL to a relative file path by removing the base URL.
 * @param {string} fileUrl - The complete URL to be converted to a relative path.
 * @returns {string} The original relative file path.
 */
function convertToRelativePath(fileUrl: string): string {
	/**
	 * define server url based on application runtime environment
	 * @type {string}
	 */
	const serverURL: string = process.env.SERVER_LINK;

	/**
	 * Remove the base URL from the complete URL.
	 * @type {string}
	 */
	const relativePath: string = fileUrl.replace(serverURL + "/", "");

	/**
	 * Add back the leading './' to create the original relative file path.
	 * @type {string}
	 */
	return relativePath[0] === "/" ? relativePath : `/${relativePath}`;
}

/**
 * Removes uploaded files from the file system. Handles both single and multiple file scenarios.
 * @param {TMulterFile} files - The file or files metadata provided by multer.
 * @param {boolean} multiFile - A flag indicating whether the input contains multiple files (default: `false`).
 * @returns {boolean} - Returns `true` after successfully removing the files.
 */
export function removeUploadedFiles(
	files: TMulterFile,
	multiFile: boolean = false
): boolean {
	if (multiFile) {
		/**  Loop through each file object and remove it if it exists */
		for (const file of Object.values(files)) {
			if (existsSync(file[0]?.path)) {
				/** Remove the file */
				unlinkSync(file[0].path);
			}
		}
	} else {
		/** Remove a single file if it exists */
		if (existsSync(files?.path)) {
			unlinkSync(files.path);
		}
	}

	return true;
}

/**
 * Finalizes the upload process by moving the uploaded file to its final directory. *
 * @param {TMulterFile} file - The file metadata provided by multer.
 * @param {number | undefined} userId - The ID of the user associated with the upload (optional).
 * @param {string} finalPath - The target directory (relative to the base upload directory).
 * @returns {Promise<string>} - The relative path to the finalized file .
 */
export async function uploadFinalization(
	file: TMulterFile,
	userId: number | undefined,
	finalPath: string
): Promise<string> {
	let filePath: string;

	/** Determine the final file path based on the presence of a user ID */
	if (userId) {
		filePath = `./public/uploads/users/${userId}/${finalPath}`;
	} else {
		filePath = `./public/uploads/${finalPath}`;
	}

	/** Ensure the target directory exists, creating it recursively if necessary */
	mkdirSync(filePath, { recursive: true });

	/** Extract the file extension and convert it to lowercase */
	const ext: string = extname(file?.originalname || "").toLowerCase();

	/** Extract the base name of the file and replace spaces with hyphens */
	const originalName: string = basename(
		file?.originalname || "",
		extname(file?.originalname || "")
	).replace(/\s/g, "-");

	/** Generate a unique file name for the uploaded file */
	const fileName = String(Date.now() + "-" + originalName + ext);

	/** Move the file to the final directory with the new name */
	await rename(file.path, `${filePath}/${fileName}`);

	return `${filePath}/${fileName}`.slice(8);
}

/**
 * File remover
 * @param {string} filePath - File location path
 */
export function fileRemoval(filePath: string) {
	/** Convert file path to relative absolute path */
	filePath = resolve("./public" + convertToRelativePath(filePath));

	/** Remove a single file if it exists */
	if (existsSync(filePath)) {
		unlinkSync(filePath);
	}
}

/**
 * Creates a multer configuration object for handling image uploads. *
 * @returns {Options} - A multer configuration object.
 */
export function multerImageUploader(): Options {
	return {
		/** Config storage option */
		storage: diskStorage({
			destination: multerDestination(),
			filename: multerFilename,
		}),
		/** Config file size limit */
		limits: {
			fileSize: 2 * 1024 * 1024,
		},
		/** Config file format filter validator */
		fileFilter: imageFormatFilter,
	};
}
