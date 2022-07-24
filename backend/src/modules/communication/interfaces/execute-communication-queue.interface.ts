import { BoardType } from 'modules/communication/dto/types';

export interface ExecuteCommunicationQueueInterface {
	execute(board: BoardType): void;
}
