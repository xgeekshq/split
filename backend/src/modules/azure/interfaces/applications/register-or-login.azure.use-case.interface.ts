import LoggedUserDto from 'src/modules/users/dto/logged.user.dto';

export interface RegisterOrLoginAzureUseCaseInterface {
	execute(azureToken: string): Promise<LoggedUserDto | null>;
}
