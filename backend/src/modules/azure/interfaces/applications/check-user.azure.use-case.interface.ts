export interface CheckUserAzureUseCaseInterface {
	execute(email: string): Promise<'local' | 'az'>;
}
