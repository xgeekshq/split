import User from '../../entities/user.schema';

export interface GetUserUseCaseInterface {
	execute(userId: string): Promise<User>;
}
