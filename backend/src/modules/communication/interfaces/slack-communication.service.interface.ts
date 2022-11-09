import { BoardType, ChangeResponsibleType, MergeBoardCommunicationType } from '../dto/types';

export interface SlackCommunicationServiceInterface {
	execute(board: BoardType): Promise<void>;
	executeResponsibleChange(changeResponsibleDto: ChangeResponsibleType);
	executeMergeBoardNotification(mergeBoard: MergeBoardCommunicationType);
}
