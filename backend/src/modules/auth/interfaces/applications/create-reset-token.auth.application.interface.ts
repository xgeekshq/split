export interface CreateResetTokenAuthApplicationInterface {
	create(emailAddress: string): Promise<{
		message: string;
	}>;
}
