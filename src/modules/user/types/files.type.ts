import { TMulterFile } from "src/common/utils/multer.utils";

/**
 * Define Profile image and profile background type
 */
export type TProfileImages = {
	profile_image: TMulterFile[];
	profile_bg_image: TMulterFile[];
};
