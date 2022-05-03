/* eslint-disable @typescript-eslint/ban-types */
import { LeanDocument, Query } from 'mongoose';
import { BoardDocument } from '../../../modules/boards/schemas/board.schema';

export type QueryBoardDocument = Query<
  LeanDocument<BoardDocument> | null,
  LeanDocument<BoardDocument>,
  {},
  LeanDocument<BoardDocument>
>;
export type QueryBoardArrayDocument = Query<
  LeanDocument<BoardDocument>[] | null,
  LeanDocument<BoardDocument>,
  {},
  LeanDocument<BoardDocument>
>;
