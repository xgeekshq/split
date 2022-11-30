import { MongooseModule } from '@nestjs/mongoose';
import ResetPassword, { ResetPasswordSchema } from 'src/modules/auth/schemas/reset-password.schema';
import Board, { BoardSchema } from 'src/modules/boards/schemas/board.schema';
import BoardUser, { BoardUserSchema } from 'src/modules/boards/schemas/board.user.schema';
import Schedules, { SchedulesSchema } from 'src/modules/schedules/schemas/schedules.schema';
import TeamUser, { TeamUserSchema } from 'src/modules/teams/schemas/team.user.schema';
import Team, { TeamSchema } from 'src/modules/teams/schemas/teams.schema';
import User, { UserSchema } from 'src/modules/users/entities/user.schema';

export const mongooseBoardModule = MongooseModule.forFeature([
	{ name: Board.name, schema: BoardSchema }
]);

export const mongooseBoardUserModule = MongooseModule.forFeature([
	{ name: BoardUser.name, schema: BoardUserSchema }
]);

export const mongooseUserModule = MongooseModule.forFeature([
	{ name: User.name, schema: UserSchema }
]);

export const mongooseResetModule = MongooseModule.forFeature([
	{ name: ResetPassword.name, schema: ResetPasswordSchema }
]);

export const mongooseTeamModule = MongooseModule.forFeature([
	{ name: Team.name, schema: TeamSchema }
]);

export const mongooseTeamUserModule = MongooseModule.forFeature([
	{ name: TeamUser.name, schema: TeamUserSchema }
]);

export const mongooseSchedulesModule = MongooseModule.forFeature([
	{ name: Schedules.name, schema: SchedulesSchema }
]);
