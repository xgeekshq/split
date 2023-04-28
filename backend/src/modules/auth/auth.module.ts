import { userRepository } from 'src/modules/users/users.providers';
import { mongooseBoardUserModule } from './../../infrastructure/database/mongoose.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import {
	mongooseResetModule,
	mongooseUserModule
} from 'src/infrastructure/database/mongoose.module';
import { JwtRegister } from '../../infrastructure/config/jwt.register';
import BoardsModule from '../boards/boards.module';
import TeamsModule from '../teams/teams.module';
import UsersModule from '../users/users.module';
import {
	createResetPasswordTokenUseCase,
	getTokenAuthService,
	refreshTokenUseCase,
	registerGuestUserUseCase,
	registerUserUseCase,
	resetPasswordRepository,
	resetPasswordUseCase,
	signInUseCase,
	statisticsAuthUserUseCase,
	validateUserAuthService,
	validateUserEmailUseCase
} from './auth.providers';
import AuthController from './controller/auth.controller';
import JwtStrategy from './strategy/jwt.strategy';
import LocalStrategy from './strategy/local.strategy';
import JwtRefreshTokenStrategy from './strategy/refresh.strategy';
import TeamUsersModule from 'src/modules/teamUsers/teamusers.module';

@Module({
	imports: [
		UsersModule,
		TeamsModule,
		TeamUsersModule,
		JwtRegister,
		BoardsModule,
		PassportModule,
		ConfigModule,
		mongooseResetModule,
		mongooseUserModule,
		mongooseBoardUserModule
	],
	providers: [
		getTokenAuthService,
		validateUserAuthService,
		registerUserUseCase,
		registerGuestUserUseCase,
		validateUserEmailUseCase,
		statisticsAuthUserUseCase,
		signInUseCase,
		refreshTokenUseCase,
		createResetPasswordTokenUseCase,
		resetPasswordUseCase,
		UsersModule,
		userRepository,
		LocalStrategy,
		JwtStrategy,
		JwtRefreshTokenStrategy,
		resetPasswordRepository
	],
	controllers: [AuthController],
	exports: [getTokenAuthService, resetPasswordRepository, validateUserAuthService]
})
export default class AuthModule {}
