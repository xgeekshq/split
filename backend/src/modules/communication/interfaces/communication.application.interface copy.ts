export interface AddUserIntoChannelApplicationInterface {
	execute(email: string): Promise<boolean>;
}
