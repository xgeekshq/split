export interface CreateResetTokenUseCaseInterface {
	execute(emailAddress: string): Promise<{
		message: string;
	}>;
}
