import { UpdateBoardDto } from 'src/modules/boards/dto/update-board.dto';
import { BoardUserFactory } from '../boardUser-factory.mock';
import { buildTestFactory } from '../generic-factory.mock';
import { BoardDtoFactory } from './boardDto-factory.mock';

const mockUpdateBoardDto = () => {
	return {
		responsible: BoardUserFactory.create(),
		...BoardDtoFactory.create()
	};
};

export const UpdateBoardDtoFactory = buildTestFactory<UpdateBoardDto>(() => {
	return mockUpdateBoardDto();
});
