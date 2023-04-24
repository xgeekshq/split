import { UpdateBoardDto } from 'src/modules/boards/dto/update-board.dto';
import { BoardUserFactory } from '../boardUser-factory.mock';
import { buildTestFactory } from '../generic-factory.mock';
import { BoardDtoFactory } from './boardDto-factory.mock';

const boardData = BoardDtoFactory.create();

const mockUpdateBoardDto = () => {
	return {
		responsible: BoardUserFactory.create(),
		boardId: boardData._id,
		completionHandler: () => {
			return;
		},
		...boardData
	};
};

export const UpdateBoardDtoFactory = buildTestFactory<UpdateBoardDto>(() => {
	return mockUpdateBoardDto();
});
