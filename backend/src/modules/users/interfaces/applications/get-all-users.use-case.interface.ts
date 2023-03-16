import User from '../../entities/user.schema';

export interface GetAllUsersUseCaseInterface {
	execute(): Promise<User[]>;
}
