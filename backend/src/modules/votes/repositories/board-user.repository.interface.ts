import BoardUser from 'src/modules/boards/entities/board.user.schema';
import { BaseInterfaceRepository } from 'src/libs/repositories/interfaces/base.repository.interface';

export interface VotesBoardUserRepositoryInterface extends BaseInterfaceRepository<BoardUser> {}
