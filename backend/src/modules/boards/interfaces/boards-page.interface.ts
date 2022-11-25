import { LeanDocument } from 'mongoose';
import { BoardDocument } from '../schemas/board.schema';

export interface BoardsAndPage {
	boards: LeanDocument<BoardDocument>[];
	hasNextPage: boolean;
	page: number;
}
