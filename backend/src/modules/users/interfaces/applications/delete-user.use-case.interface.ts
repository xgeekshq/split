export interface DeleteUserUseCaseInterface {
	execute(userId: string): Promise<boolean>;
}
