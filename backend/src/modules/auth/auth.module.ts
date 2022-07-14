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
	registerAuthApplication,
	registerAuthService,
	validateUserAuthService
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
		mongooseUserModule
	],
	providers: [
		getTokenAuthService,
		registerAuthService,
		validateUserAuthService,
		getTokenAuthApplication,
		registerAuthApplication,
		createResetTokenAuthApplication,
		createResetTokenAuthService,
		UsersModule,
		LocalStrategy,
		JwtStrategy,
		JwtRefreshTokenStrategy
	],
	controllers: [AuthController],
	exports: [getTokenAuthService]
})
export default class AuthModule {}
