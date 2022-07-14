import LoggedUserDto from 'modules/users/dto/logged.user.dto';

export interface AuthAzureApplication {
	registerOrLogin(azureToken: string): Promise<LoggedUserDto | null>;

	checkUserExistsInActiveDirectory(email: string): Promise<boolean>;
}
