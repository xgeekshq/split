export interface DeleteUserApplicationInterface {
	delete(userId: string): Promise<boolean>;
}
