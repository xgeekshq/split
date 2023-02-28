import { BaseInterfaceRepository } from 'src/libs/repositories/interfaces/base.repository.interface';
import BoardUser from '../entities/board.user.schema';

export interface BoardUserRepositoryInterface extends BaseInterfaceRepository<BoardUser> {
	getAllBoardsIdsOfUser(userId: string): Promise<BoardUser[]>;
}
