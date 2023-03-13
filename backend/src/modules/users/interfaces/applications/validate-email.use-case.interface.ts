export interface ValidateUserEmailUseCaseInterface {
	execute(email: string): Promise<boolean>;
}
