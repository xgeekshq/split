import { LeanDocument, Model } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import GetTokenAuthServiceImpl from '../../../src/modules/auth/services/get-token.auth.service';
import { updateUserService } from '../../../src/modules/users/users.providers';
import { UserDocument } from '../../../src/modules/users/schemas/user.schema';
import mockedUser from '../../../src/libs/test-utils/mocks/user/user.mock';
import AppConfigModule from '../../../src/infrastructure/config/config.module';
import { JwtRegister } from '../../../src/infrastructure/config/jwt.register';
import {
  mongooseBoardModule,
  mongooseUserModule,
} from '../../../src/infrastructure/database/mongoose.module';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../src/libs/test-utils/mongoose.test.module';
import { TYPES } from '../../../src/modules/users/interfaces/types';
import { UpdateUserService } from '../../../src/modules/users/interfaces/services/update.user.service.interface';

describe('GetTokenAuthService', () => {
  let service: GetTokenAuthServiceImpl;
  let userModel: Model<UserDocument>;
  let updateUserSrvice: UpdateUserService;
  let user: LeanDocument<UserDocument>;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AppConfigModule,
        JwtRegister,
        rootMongooseTestModule(),
        mongooseBoardModule,
        mongooseUserModule,
      ],
      providers: [GetTokenAuthServiceImpl, updateUserService],
    }).compile();

    service = module.get<GetTokenAuthServiceImpl>(GetTokenAuthServiceImpl);
    updateUserSrvice = module.get(TYPES.services.UpdateUserService);
    userModel = module.get<Model<UserDocument>>('UserModel');
    user = (await userModel.create(mockedUser)).toObject();
  });

  describe('service class', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('when ask for accessToken', () => {
    it('should return a token', async () => {
      const token = service.getAccessToken(user._id);
      expect(token).toBeDefined();
    });
  });
  describe('when ask for refreshToken', () => {
    it('should return a token', async () => {
      const token = service.getRefreshToken(user._id);
      expect(token).toBeDefined();
    });
  });

  describe('when ask the tokens for the login', () => {
    describe('and the user is correctly upate', () => {
      it('should return a token', async () => {
        const token = await service.getTokens(user._id);
        expect(token).toBeDefined();
      });
    });
    describe('and the user is not correctly upate', () => {
      it('should return a token', async () => {
        jest
          .spyOn(updateUserSrvice, 'setCurrentRefreshToken')
          .mockReturnValueOnce(null as any);
        const token = await service.getTokens(user._id);
        expect(token).toEqual(null);
      });
    });
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
