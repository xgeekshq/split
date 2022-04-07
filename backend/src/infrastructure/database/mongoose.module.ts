import { MongooseModule } from '@nestjs/mongoose';
import User, { UserSchema } from '../../modules/users/schemas/user.schema';
import Board, { BoardSchema } from '../../modules/boards/schemas/board.schema';
import BoardUser, {
  BoardUserSchema,
} from '../../modules/boards/schemas/board.user.schema';

export const mongooseBoardModule = MongooseModule.forFeature([
  { name: Board.name, schema: BoardSchema },
]);

export const mongooseBoardUserModule = MongooseModule.forFeature([
  { name: BoardUser.name, schema: BoardUserSchema },
]);

export const mongooseUserModule = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
]);
