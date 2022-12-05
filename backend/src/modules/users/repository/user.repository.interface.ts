import { BaseInterfaceRepository } from 'src/libs/repositories/interfaces/base.repository.interface';
import User from '../entities/user.schema';

export type UserRepositoryInterface = BaseInterfaceRepository<User>;
