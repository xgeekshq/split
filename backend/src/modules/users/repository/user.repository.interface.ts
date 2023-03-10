import { BaseInterfaceRepository } from 'src/libs/repositories/interfaces/base.repository.interface';
import User from '../entities/user.schema';

export interface UserRepositoryInterface extends BaseInterfaceRepository<User> {
	getById(userId: string): Promise<User>;
	updateUserWithRefreshToken(refreshToken: string, userId: string): Promise<User>;
	updateUserPassword(email: string, password: string): Promise<User>;
	updateSuperAdmin(userId: string, isSAdmin: boolean): Promise<User>;
	updateUserAvatar(userId: string, avatarUrl: string): Promise<User>;
	deleteUser(userId: string, withSession: boolean);
	getAllWithPagination(page: number, size: number, searchUser?: string): Promise<User[]>;
	getAllSignedUpUsers(): Promise<User[]>;
	getSignedUpUsersCount(): Promise<number>;
	updateUserUpdatedAt(user: string): Promise<User>;
}
