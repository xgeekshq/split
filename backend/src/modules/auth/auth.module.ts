import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import AuthController from './controller/auth.controller';
import UsersModule from '../users/users.module';
import LocalStrategy from './strategy/local.strategy';
import JwtStrategy from './strategy/jwt.strategy';
import JwtRefreshTokenStrategy from './strategy/refresh.strategy';
import {
  getTokenAuthService,
  registerAuthService,
  validateUserAuthService,
  getTokenAuthApplication,
  registerAuthApplication,
} from './auth.providers';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwt.accessToken.secret'),
        signOptions: {
          expiresIn: `${configService.get('jwt.accessToken.expirationTime')}s`,
        },
      }),
    }),
  ],
  providers: [
    getTokenAuthService,
    registerAuthService,
    validateUserAuthService,
    getTokenAuthApplication,
    registerAuthApplication,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
  ],
  controllers: [AuthController],
  exports: [getTokenAuthService],
})
export default class AuthModule {}
