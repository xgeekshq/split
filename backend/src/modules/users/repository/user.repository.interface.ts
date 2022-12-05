import { BaseInterfaceRepository } from 'src/libs/repositories/interfaces/base.repository.interface';
import User from '../entities/user.schema';

export interface UserRepositoryInterface extends BaseInterfaceRepository<User> {
	getById(userId: string): Promise<User>;
	updateUserWithRefreshToken(refreshToken: string, userId: string): Promise<User>;
	updateUserPassword(email: string, password: string): Promise<User>;
}
