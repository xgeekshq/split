export interface DeleteUserServiceInterface {
	delete(userId: string): Promise<boolean>;
}
