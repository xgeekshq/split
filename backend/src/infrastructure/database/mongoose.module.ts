import { MongooseModule } from '@nestjs/mongoose';
import User, { UserSchema } from '../../modules/users/schemas/user.schema';
import Board, { BoardSchema } from '../../modules/boards/schemas/board.schema';
import BoardUser, {
  BoardUserSchema,
} from '../../modules/boards/schemas/board.user.schema';
import TeamUser, {
  TeamUserSchema,
} from '../../modules/teams/schemas/team.user.schema';
import Team, { TeamSchema } from '../../modules/teams/schemas/teams.schema';
import ResetPassword, {
  ResetPasswordSchema,
} from '../../modules/auth/schemas/reset-password.schema';
import Schedules, {
  SchedulesSchema,
} from '../../modules/schedules/schemas/schedules.schema';

export const mongooseBoardModule = MongooseModule.forFeature([
  { name: Board.name, schema: BoardSchema },
]);

export const mongooseBoardUserModule = MongooseModule.forFeature([
  { name: BoardUser.name, schema: BoardUserSchema },
]);

export const mongooseUserModule = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
]);

export const mongooseResetModule = MongooseModule.forFeature([
  { name: ResetPassword.name, schema: ResetPasswordSchema },
]);

export const mongooseTeamModule = MongooseModule.forFeature([
  { name: Team.name, schema: TeamSchema },
]);

export const mongooseTeamUserModule = MongooseModule.forFeature([
  { name: TeamUser.name, schema: TeamUserSchema },
]);

export const mongooseSchedulesModule = MongooseModule.forFeature([
  { name: Schedules.name, schema: SchedulesSchema },
]);
