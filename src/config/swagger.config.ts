import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

/**
 * initialize swagger document
 * @param app NestJS Application instance
 */
export function swaggerConfiguration(app: INestApplication) {
	/** define the swagger options and configs */
	const document = new DocumentBuilder()
		.setTitle("NestJS Virgool")
		.setDescription("Practical experience of Virgool")
		.setVersion("0.0.1")
		.build();

	/** Initialize swagger document based on defined options */
	const swaggerDocument = SwaggerModule.createDocument(app, document);

	/** setup swagger ui page */
	SwaggerModule.setup("/api-doc", app, swaggerDocument);
}
