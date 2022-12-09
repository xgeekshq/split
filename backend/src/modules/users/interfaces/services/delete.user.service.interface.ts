import RequestWithUser from 'src/libs/interfaces/requestWithUser.interface';

export interface DeleteUserServiceInterface {
	delete(request: RequestWithUser, userId: string): Promise<boolean>;
}
