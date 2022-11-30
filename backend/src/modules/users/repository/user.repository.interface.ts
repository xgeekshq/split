import { BaseInterfaceRepository } from 'src/libs/repositories/interfaces/base.repository.interface';
import User from '../entities/user';

export type UserRepositoryInterface = BaseInterfaceRepository<User>;
