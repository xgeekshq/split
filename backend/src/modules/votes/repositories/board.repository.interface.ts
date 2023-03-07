import { BaseInterfaceRepository } from 'src/libs/repositories/interfaces/base.repository.interface';
import Board from 'src/modules/boards/entities/board.schema';

export interface VotesBoardRepositoryInterface extends BaseInterfaceRepository<Board> {}
