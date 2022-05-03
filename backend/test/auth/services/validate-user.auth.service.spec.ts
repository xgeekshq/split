import { Model, LeanDocument } from 'mongoose';
import { Test } from '@nestjs/testing';
import ValidateUserAuthServiceImpl from '../../../src/modules/auth/services/validate-user.auth.service';
import {
  getUserService,
  updateUserService,
} from '../../../src/modules/users/users.providers';
import { GetUserService } from '../../../src/modules/users/interfaces/services/get.user.service.interface';
import { TYPES } from '../../../src/modules/users/interfaces/types';
import * as authTypes from '../../../src/modules/auth/interfaces/types';
import {
  mongooseBoardModule,
  mongooseUserModule,
} from '../../../src/infrastructure/database/mongoose.module';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../src/libs/test-utils/mongoose.test.module';
import { UserDocument } from '../../../src/modules/users/schemas/user.schema';
import { getTokenAuthService } from '../../../src/modules/auth/auth.providers';
import { GetTokenAuthService } from '../../../src/modules/auth/interfaces/services/get-token.auth.service.interface';
import mockedUser, {
  mockLeanUser,
} from '../../../src/libs/test-utils/mocks/user/user.mock';
import AppConfigModule from '../../../src/infrastructure/config/config.module';
import { JwtRegister } from '../../../src/infrastructure/config/jwt.register';
import { encrypt } from '../../../src/libs/utils/bcrypt';

const spyGetByEmail = (service: GetUserService, value: any) => {
  jest.spyOn(service, 'getByEmail').mockReturnValueOnce(value as any);
};

describe('ValidateAuthServiceIntegration', () => {
  let authenticationService: ValidateUserAuthServiceImpl;
  let gUserService: GetUserService;
  let authTokenService: GetTokenAuthService;
  let userModel: Model<UserDocument>;
  let user: LeanDocument<UserDocument>;
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        AppConfigModule,
        JwtRegister,
        rootMongooseTestModule(),
        mongooseBoardModule,
        mongooseUserModule,
      ],
      providers: [
        ValidateUserAuthServiceImpl,
        getUserService,
        getTokenAuthService,
        updateUserService,
      ],
    }).compile();
    authenticationService = await module.get(ValidateUserAuthServiceImpl);
    gUserService = await module.get(TYPES.services.GetUserService);
    authTokenService = await module.get(
      authTypes.TYPES.services.GetTokenAuthService,
    );
    userModel = module.get<Model<UserDocument>>('UserModel');
    const hashedPassword = await encrypt(mockedUser.password);
    user = (
      await userModel.create({ ...mockedUser, password: hashedPassword })
    ).toObject();
  });
  describe('when validating the user with credentials', () => {
    describe('and the user is found', () => {
      describe('and the passwords match', () => {
        it('should return a user', async () => {
          const userFound =
            await authenticationService.validateUserWithCredentials(
              user.email,
              mockedUser.password,
            );
          expect(userFound).toEqual(user);
        });
      });
      describe('and the passwords dont match', () => {
        it('should attempt to get a user by email', async () => {
          const res = await authenticationService.validateUserWithCredentials(
            user.email,
            '1',
          );
          expect(res).toEqual(null);
        });
      });
    });
    describe('and the user is not found', () => {
      it('should throw a error', async () => {
        spyGetByEmail(gUserService, null);
        expect(
          await authenticationService.validateUserWithCredentials(
            user.email,
            mockedUser.password,
          ),
        ).toEqual(null);
      });
    });
  });

  describe('when validating the user by id', () => {
    describe('and the user is found', () => {
      it('should return the user', async () => {
        const userFound = await authenticationService.validateUserById(
          user._id,
        );
        expect(userFound).toEqual(mockLeanUser(user));
      });
    });
    describe('and the user is not found', () => {
      it('should throw a exception', async () => {
        jest.spyOn(gUserService, 'getById').mockReturnValueOnce(null as any);
        expect(await authenticationService.validateUserById(user._id)).toEqual(
          null,
        );
      });
    });
  });
  describe('when validating user by refresh token', () => {
    let refreshToken = '';
    describe('and the user is found', () => {
      it('should return the user', async () => {
        const tokens = await authTokenService.getTokens(user._id);
        refreshToken = tokens!.refreshToken.token;
        user = await userModel.findById(user._id).lean();
        const userFound =
          await authenticationService.validateUserByRefreshToken(
            refreshToken,
            user._id,
          );
        expect(userFound).toEqual(mockLeanUser(user));
      });
    });
    describe('and the user is not found', () => {
      it('should throw a exception', async () => {
        jest
          .spyOn(gUserService, 'getUserIfRefreshTokenMatches')
          .mockReturnValue(null as any);
        expect(
          await authenticationService.validateUserByRefreshToken(
            refreshToken,
            user._id,
          ),
        ).toEqual(null);
      });
    });
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
