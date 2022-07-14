export interface CreateResetTokenAuthService {
	create(emailAddress: string): Promise<{
		message: string;
	}>;
}
