import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";
import { ValidationMessage } from "../enums/messages.enum";
import { removeUploadedFiles } from "../utils/multer.utils";

/**
 * Implement custom response logic for exceptions.
 * This filter will change the servers exception response
 * structure before sending it to client
 */

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	/** Catch the incoming exception */
	catch(exception: HttpException, host: ArgumentsHost) {
		/** Extracting the HTTP request and response object from host object */
		const ctx = host.switchToHttp();
		const response: Response = ctx.getResponse<Response>();
		const request: Request = ctx.getRequest<Request>();

		/** Retrieves the HTTP status code from the response */
		const statusCode: number = exception.getStatus();

		/** Retrieve the exception's response message */
		const exceptionResponse: string | object = exception.getResponse();

		let message: string = "";

		/** Check if the response is an object or a string */
		if (typeof exceptionResponse === "string") {
			/** Handle case where the response is a string */
			message = exceptionResponse;
		} else if (
			/** Check if the data is and object with a message property */
			typeof exceptionResponse === "object" &&
			"message" in exceptionResponse
		) {
			/** Handle case where the response is an object */
			message = (exceptionResponse as { message: string }).message;
		}

		/** Set a custom message is the error is due to the upload proses large payload error */
		if (statusCode === HttpStatus.PAYLOAD_TOO_LARGE) {
			message = ValidationMessage.TooLargePayload;
		}

		/** Retrieve files from the request */
		let files = request.files || request.file;

		/** Handle single or multiple files removal process */
		if (files) {
			const isMultiFile = !Object.keys(files).includes("fieldname");
			// @ts-ignore
			removeUploadedFiles(files, isMultiFile);
		}

		/** return a custom response object to client */
		response.status(statusCode).json({
			statusCode,
			success: false,
			message,
			timestamp: new Date().toISOString(),
		});
	}
}
