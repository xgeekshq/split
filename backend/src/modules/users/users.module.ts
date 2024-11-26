import { Module, forwardRef } from '@nestjs/common';
import {
	mongooseResetModule,
	mongooseTeamUserModule,
	mongooseUserModule
} from 'src/infrastructure/database/mongoose.module';
import TeamsModule from 'src/modules/teams/teams.module';
import AuthModule from '../auth/auth.module';
import UsersController from './controller/users.controller';
import {
	createUserService,
	deleteUserUseCase,
	getAllUsersUseCase,
	getAllUsersWithTeamsUseCase,
	getUserService,
	getUserUseCase,
	updateSAdminUseCase,
	updateUserService,
	userRepository
} from './users.providers';
import TeamUsersModule from '../teamUsers/teamusers.module';
import BoardUsersModule from '../boardUsers/boardusers.module';

@Module({
	imports: [
		mongooseUserModule,
		TeamsModule,
		TeamUsersModule,
		BoardUsersModule,
		mongooseResetModule,
		mongooseTeamUserModule,
		forwardRef(() => AuthModule)
	],
	providers: [
		getAllUsersUseCase,
		getAllUsersWithTeamsUseCase,
		getUserUseCase,
		updateSAdminUseCase,
		createUserService,
		getUserService,
		deleteUserUseCase,
		updateUserService,
		userRepository
	],
	controllers: [UsersController],
	exports: [createUserService, getUserService, updateUserService]
})
export default class UsersModule {}
