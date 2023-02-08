import { BaseInterfaceRepository } from 'src/libs/repositories/interfaces/base.repository.interface';
import Board from 'src/modules/boards/entities/board.schema';
import { UpdateColumnDto } from '../dto/update-column.dto';

export interface ColumnRepositoryInterface extends BaseInterfaceRepository<Board> {
	updateColumn(boardId: string, column: UpdateColumnDto): Promise<Board>;
	deleteCards(boardId: string, columnId: string): Promise<Board>;
}
