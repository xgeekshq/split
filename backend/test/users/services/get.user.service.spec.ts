import { Test } from '@nestjs/testing';
import { LeanDocument, Model } from 'mongoose';
import { UserDocument } from '../../../src/modules/users/schemas/user.schema';
import GetUserServiceImpl from '../../../src/modules/users/services/get.user.service';
import {
  mongooseBoardModule,
  mongooseUserModule,
} from '../../../src/infrastructure/database/mongoose.module';
import mockedUser, {
  mockLeanUser,
  userId,
} from '../../../src/libs/test-utils/mocks/user/user.mock';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../src/libs/test-utils/mongoose.test.module';
import { getTokenAuthService } from '../../../src/modules/auth/auth.providers';
import { TYPES } from '../../../src/modules/auth/interfaces/types';
import { GetTokenAuthService } from '../../../src/modules/auth/interfaces/services/get-token.auth.service.interface';
import { updateUserService } from '../../../src/modules/users/users.providers';
import { JwtRegister } from '../../../src/infrastructure/config/jwt.register';
import AppConfigModule from '../../../src/infrastructure/config/config.module';

describe('GetUserService', () => {
  let service: GetUserServiceImpl;
  let authService: GetTokenAuthService;
  let userModel: Model<UserDocument>;
  let user: LeanDocument<UserDocument>;
  let refreshToken: string;
  beforeAll(async () => {
    const app = await Test.createTestingModule({
      imports: [
        AppConfigModule,
        JwtRegister,
        rootMongooseTestModule(),
        mongooseBoardModule,
        mongooseUserModule,
      ],
      providers: [GetUserServiceImpl, getTokenAuthService, updateUserService],
    }).compile();

    service = app.get<GetUserServiceImpl>(GetUserServiceImpl);
    userModel = app.get<Model<UserDocument>>('UserModel');
    authService = app.get<GetTokenAuthService>(
      TYPES.services.GetTokenAuthService,
    );
    user = (await userModel.create(mockedUser)).toObject();
    const tokens = await authService.getTokens(user._id);
    user = await userModel.findById(user._id).lean();
    refreshToken = tokens!.refreshToken.token;
  });

  describe('when try to get user by email', () => {
    describe('and the user is found', () => {
      it('should return the user', async () => {
        const userFound = await service.getByEmail(user.email);
        expect(userFound).toEqual(user);
      });
    });
  });

  describe('when try to get user by id', () => {
    describe('and the user is found', () => {
      it('should return the user', async () => {
        const userFound = await service.getById(user._id);
        expect(userFound).toEqual(mockLeanUser(user));
      });
    });
  });

  describe('when trying to get user if refresh token matches', () => {
    describe('and the user is found', () => {
      it('should return the user', async () => {
        const userFound = await service.getUserIfRefreshTokenMatches(
          refreshToken,
          user._id,
        );
        expect(userFound).toEqual(mockLeanUser(user));
      });
    });
    describe('and the user is not found or doesnt have the refresh token', () => {
      describe('and the tokens does not match', () => {
        it('should return false', async () => {
          let userFound = await service.getUserIfRefreshTokenMatches(
            '1',
            user._id,
          );
          expect(userFound).toEqual(false);
          userFound = await service.getUserIfRefreshTokenMatches('1', userId);
          expect(userFound).toEqual(false);
        });
      });
      it('should return false', async () => {
        await userModel.updateOne(
          { _id: user._id },
          { $set: { currentHashedRefreshToken: null } },
        );
        const userFound = await service.getUserIfRefreshTokenMatches(
          '1',
          user._id,
        );
        expect(userFound).toEqual(false);
      });
    });
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
