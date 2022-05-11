import { LeanDocument } from 'mongoose';
import { BoardDocument } from '../schemas/board.schema';

export type GetBoardInterface =
  | { board: LeanDocument<BoardDocument> }
  | {
      board: LeanDocument<BoardDocument>;
      mainBoardData: LeanDocument<BoardDocument>;
    }
  | null;
