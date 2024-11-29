import { Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import { ImageDto } from "./dto/image.dto";
import {
	fileRemoval,
	TMulterFile,
	uploadFinalization,
} from "src/common/utils/multer.utils";
import { InjectRepository } from "@nestjs/typeorm";
import { ImageEntity } from "./entities/image.entity";
import { Repository } from "typeorm";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import {
	NotFoundMessage,
	SuccessMessage,
} from "src/common/enums/messages.enum";

@Injectable({ scope: Scope.REQUEST })
export class ImageService {
	constructor(
		/** Register image repository */
		@InjectRepository(ImageEntity)
		private imageRepository: Repository<ImageEntity>,

		/** Register current request */
		@Inject(REQUEST) private request: Request
	) {}

	/**
	 * Upload new image into gallery
	 * @param {TMulterFile} image - Uploaded file
	 * @param {ImageDto} imageDto - uploaded file data
	 */
	async create(image: TMulterFile, imageDto: ImageDto) {
		/** Extract user id from request */
		const userId = this.request.user.id;

		/** Create images alt value if it was left empty */
		imageDto.alt = imageDto.alt || imageDto.name;

		/** finalize upload process */
		const location = await uploadFinalization(image, undefined, "gallery");

		/** Insert image's data to database */
		await this.imageRepository.insert({
			...imageDto,
			location,
			userId,
		});

		return SuccessMessage.Default;
	}

	/**
	 * Retrieve all of user's uploaded images
	 */
	findAll() {
		/** Extract user id from request */
		const userId = this.request.user.id;

		/** Retrieve user's images */
		return this.imageRepository.find({
			where: { userId },
			select: {
				id: true,
				name: true,
				location: true,
				alt: true,
				created_at: true,
			},
		});
	}

  /**
   * Remove a file by id
   * @param {number} id - image id number
   */
	async remove(id: number) {
		/** Extract user id from request */
		const userId = this.request.user.id;

		/** Check image existence */
		const image = await this.imageRepository.findOneBy({ userId, id });
		/** Throw error if image was not found */
		if (!image) throw new NotFoundException(NotFoundMessage.Image);

		/** Delete image from database */
		await this.imageRepository.remove(image);

		/** Remove local file */
		fileRemoval(image.location);

		return SuccessMessage.Default;
	}
}
