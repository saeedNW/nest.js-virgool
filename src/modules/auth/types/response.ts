export type TAuthResponse = {
	token: string;
	code: string;
};

export type TGoogleUser = {
	id: number;
	firstName?: string;
	lastName?: string;
	email: string;
	profile_image?: string;
	accessToken?: string;
};
