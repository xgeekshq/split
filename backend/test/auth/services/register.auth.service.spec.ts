import { Test, TestingModule } from '@nestjs/testing';
import {
  createUserService,
  updateUserService,
} from '../../../src/modules/users/users.providers';
import mockedUser from '../../../src/libs/test-utils/mocks/user/user.mock';
import RegisterAuthServiceImpl from '../../../src/modules/auth/services/register.auth.service';
import {
  mongooseBoardModule,
  mongooseUserModule,
} from '../../../src/infrastructure/database/mongoose.module';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../src/libs/test-utils/mongoose.test.module';

describe('RegisterAuthService', () => {
  let service: RegisterAuthServiceImpl;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        mongooseBoardModule,
        mongooseUserModule,
      ],
      providers: [
        RegisterAuthServiceImpl,
        updateUserService,
        createUserService,
      ],
    }).compile();

    service = module.get<RegisterAuthServiceImpl>(RegisterAuthServiceImpl);
  });

  describe('service class', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('when try to create a user', () => {
    describe('and insert all necessary fields', () => {
      it('should create and return it', async () => {
        const user = await service.register(mockedUser);
        expect(user.name).toEqual(mockedUser.name);
        expect(user.email).toEqual(mockedUser.email);
      });
    });
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
