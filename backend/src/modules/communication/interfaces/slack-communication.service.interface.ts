import {
	AddUserMainChannelType,
	BoardType,
	ChangeResponsibleType,
	MergeBoardType
} from '../dto/types';

export interface CommunicationServiceInterface {
	execute(board: BoardType): Promise<void>;
	executeResponsibleChange(changeResponsibleDto: ChangeResponsibleType): Promise<void>;
	executeMergeBoardNotification(mergeBoard: MergeBoardType): Promise<void>;
	executeAddUserMainChannel(user: AddUserMainChannelType): Promise<void>;
}
