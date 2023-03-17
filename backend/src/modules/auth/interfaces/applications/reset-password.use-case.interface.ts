export interface ResetPasswordUseCaseInterface {
	execute(
		token: string,
		newPassword: string,
		newPasswordConf: string
	): Promise<{
		status: string;
		message: string;
	}>;
}
