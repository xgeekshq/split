import RequestWithUser from 'src/libs/interfaces/requestWithUser.interface';

export interface DeleteUserApplicationInterface {
	delete(request: RequestWithUser, userId: string): Promise<boolean>;
}
