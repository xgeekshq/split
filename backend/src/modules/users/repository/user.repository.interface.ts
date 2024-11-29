import { BaseInterfaceRepository } from 'src/libs/repositories/interfaces/base.repository.interface';
import User from '../entities/user.schema';
import { TSoftDelete } from 'src/infrastructure/database/plugins/soft-delete.plugin';
import { FilterQuery, QueryOptions } from 'mongoose';
import { DeleteResult } from 'mongodb';

export interface UserRepositoryInterface extends BaseInterfaceRepository<User> {
	getById(userId: string): Promise<User>;
	updateUserWithRefreshToken(refreshToken: string, userId: string): Promise<User>;
	updateUserPassword(email: string, password: string): Promise<User>;
	updateSuperAdmin(userId: string, isSAdmin: boolean): Promise<User>;
	updateUserAvatar(userId: string, avatarUrl: string): Promise<User>;
	deleteUser(userId: string, withSession: boolean): Promise<User>;
	getAllWithPagination(page: number, size: number, searchUser?: string): Promise<User[]>;
	getAllSignedUpUsers(): Promise<User[]>;
	getSignedUpUsersCount(): Promise<number>;
	getAllUsersIncludeDeleted(): Promise<Array<TSoftDelete<User>>>;
	updateUserUpdatedAt(user: string): Promise<User>;
	findDeleted(): Promise<Array<TSoftDelete<User>>>;
	forceDelete(query: FilterQuery<User>, options?: QueryOptions<User>): Promise<DeleteResult>;
	restore(query: FilterQuery<User>): Promise<Array<User>>;
	softDelete(query: FilterQuery<User>, options?: QueryOptions<User>): Promise<Array<User>>;
}
