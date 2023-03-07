import LoggedUserDto from 'src/modules/users/dto/logged.user.dto';

export interface AuthAzureApplicationInterface {
	registerOrLogin(azureToken: string): Promise<LoggedUserDto | null>;

	checkUserExistsInActiveDirectory(email: string): Promise<boolean>;
}
