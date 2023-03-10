export interface CreateResetTokenAuthServiceInterface {
	create(emailAddress: string): Promise<{
		message: string;
	}>;
}
