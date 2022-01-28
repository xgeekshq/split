import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import AuthService from '../auth.service';
import UsersService from '../../models/users/users.service';
import jwtService from '../../mocks/jwtService.mock';
import configService from '../../mocks/configService.mock';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        {
          provide: ConfigService,
          useValue: configService,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
        {
          provide: getModelToken('User'),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('when creating a jwt', () => {
    it('should return a object', () => {
      const userId = '1';
      expect(typeof service.getJwtAccessToken(userId)).toEqual('object');
    });
  });
});
