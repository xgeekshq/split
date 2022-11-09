import { BoardType, ChangeResponsibleType } from '../dto/types';

export interface SlackCommunicationServiceInterface {
	execute(board: BoardType): Promise<void>;
	executeResponsibleChange(changeResponsibleDto: ChangeResponsibleType);
}
