export interface DeleteTeamUserServiceInterface {
	// delete doesn't return an object
	delete(userId: string): Promise<boolean>;
}
