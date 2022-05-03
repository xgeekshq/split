import { Test } from '@nestjs/testing';
import { LeanDocument, Model } from 'mongoose';
import { UserDocument } from '../../../src/modules/users/schemas/user.schema';
import mockedUser from '../../../src/libs/test-utils/mocks/user/user.mock';
import UpdateUserServiceImpl from '../../../src/modules/users/services/update.user.service';
import {
  mongooseBoardModule,
  mongooseUserModule,
} from '../../../src/infrastructure/database/mongoose.module';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../src/libs/test-utils/mongoose.test.module';
import AppConfigModule from '../../../src/infrastructure/config/config.module';
import { JwtRegister } from '../../../src/infrastructure/config/jwt.register';

describe('UpdateUserService', () => {
  let service: UpdateUserServiceImpl;
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
      providers: [UpdateUserServiceImpl],
    }).compile();

    service = module.get<UpdateUserServiceImpl>(UpdateUserServiceImpl);
    userModel = module.get<Model<UserDocument>>('UserModel');
    user = (await userModel.create(mockedUser)).toObject();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('set current refresh token', () => {
    describe('and the user is updated correctly', () => {
      it('should not return an error', async () => {
        const userUpdated = await service.setCurrentRefreshToken('1', user._id);
        expect(userUpdated?.currentHashedRefreshToken).toBeDefined();
      });
    });
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
