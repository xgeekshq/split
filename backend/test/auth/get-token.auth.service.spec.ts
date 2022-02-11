import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import configService from '../../src/libs/test-utils/mocks/configService.mock';
import jwtService from '../../src/libs/test-utils/mocks/jwtService.mock';
import GetTokenAuthServiceImpl from '../../src/modules/auth/services/get-token.auth.service';
import { updateUserService } from '../../src/modules/users/users.providers';

describe('AuthService', () => {
  let service: GetTokenAuthServiceImpl;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetTokenAuthServiceImpl,
        updateUserService,
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

    service = module.get<GetTokenAuthServiceImpl>(GetTokenAuthServiceImpl);
  });

  describe('when creating a jwt', () => {
    it('should return a object', () => {
      const userId = '1';
      expect(typeof service.getAccessToken(userId)).toEqual('object');
    });
  });
});
