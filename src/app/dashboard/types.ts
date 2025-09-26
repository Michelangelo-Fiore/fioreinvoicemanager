/** Log In Request DTO */
export interface LogInRequest {
	email: string;
	password: string;
}

/** Log In Response DTO */
export interface LogInResponse {
	success: boolean;
	message: string;
	accessToken?: string;
	refreshToken?: string;
	user?: {
		id: number;
		email: string;
	};
}
