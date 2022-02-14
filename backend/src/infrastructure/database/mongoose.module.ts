import { MongooseModule } from '@nestjs/mongoose';
import Board, { BoardSchema } from '../../modules/boards/schemas/board.schema';

export const mongooseModule = MongooseModule.forFeature([
  { name: Board.name, schema: BoardSchema },
]);
