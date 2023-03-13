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
	createResetTokenAuthApplication,
	createResetTokenAuthService,
	getTokenAuthApplication,
	getTokenAuthService,
	registerAuthService,
	registerGuestUserUseCase,
	registerUserUseCase,
	resetPasswordRepository,
	signInUseCase,
	statisticsAuthUserUseCase,
	validateUserAuthService,
	validateUserEmailUseCase
} from './auth.providers';
import AuthController from './controller/auth.controller';
import JwtStrategy from './strategy/jwt.strategy';
import LocalStrategy from './strategy/local.strategy';
import JwtRefreshTokenStrategy from './strategy/refresh.strategy';

@Module({
	imports: [
		UsersModule,
		TeamsModule,
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
		registerAuthService,
		validateUserAuthService,
		getTokenAuthApplication,
		registerUserUseCase,
		registerGuestUserUseCase,
		validateUserEmailUseCase,
		statisticsAuthUserUseCase,
		signInUseCase,
		createResetTokenAuthApplication,
		createResetTokenAuthService,
		UsersModule,
		userRepository,
		LocalStrategy,
		JwtStrategy,
		JwtRefreshTokenStrategy,
		resetPasswordRepository
	],
	controllers: [AuthController],
	exports: [getTokenAuthService]
})
export default class AuthModule {}
