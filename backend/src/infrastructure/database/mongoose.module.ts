import { MongooseModule } from '@nestjs/mongoose';
import ResetPassword, {
	ResetPasswordSchema
} from 'src/modules/auth/entities/reset-password.schema';
import Board, { BoardSchema } from 'src/modules/boards/entities/board.schema';
import BoardUser, { BoardUserSchema } from 'src/modules/boardUsers/entities/board.user.schema';
import Schedules, { SchedulesSchema } from 'src/modules/schedules/entities/schedules.schema';
import TeamUser, { TeamUserSchema } from 'src/modules/teamUsers/entities/team.user.schema';
import Team, { TeamSchema } from 'src/modules/teams/entities/team.schema';
import User, { UserSchema } from 'src/modules/users/entities/user.schema';
import { SoftDeletePlugin } from './plugins/soft-delete.plugin';

export const mongooseBoardModule = MongooseModule.forFeature([
	{ name: Board.name, schema: BoardSchema }
]);

export const mongooseBoardUserModule = MongooseModule.forFeature([
	{ name: BoardUser.name, schema: BoardUserSchema }
]);

export const mongooseUserModule = MongooseModule.forFeatureAsync([
	{
		name: User.name,
		useFactory: () => {
			const schema = UserSchema;
			schema.plugin(SoftDeletePlugin);

			return schema;
		}
	}
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
