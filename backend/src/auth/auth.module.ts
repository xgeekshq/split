import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import AuthService from './auth.service';
import AuthController from './auth.controller';
import UsersModule from '../models/users/users.module';
import LocalStrategy from './strategy/local.strategy';
import JwtStrategy from './strategy/jwt.strategy';
import JwtRefreshTokenStrategy from './strategy/refresh.strategy';
import {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_ACCESS_TOKEN_EXPIRATION_TIME,
} from '../constants/jwt';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get(JWT_ACCESS_TOKEN_SECRET),
        signOptions: {
          expiresIn: `${configService.get(JWT_ACCESS_TOKEN_EXPIRATION_TIME)}s`,
        },
      }),
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshTokenStrategy],
  controllers: [AuthController],
})
export default class AuthModule {}
