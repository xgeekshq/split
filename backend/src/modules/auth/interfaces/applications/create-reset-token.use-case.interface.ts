export interface CreateResetPasswordTokenUseCaseInterface {
	execute(emailAddress: string): Promise<{
		message: string;
	}>;
}
