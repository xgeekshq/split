import { Test } from '@nestjs/testing';
import CreateUserServiceImpl from '../../../src/modules/users/services/create.user.service';
import mockedUser from '../../../src/libs/test-utils/mocks/user/user.mock';
import {
  mongooseBoardModule,
  mongooseUserModule,
} from '../../../src/infrastructure/database/mongoose.module';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../src/libs/test-utils/mongoose.test.module';

describe('CreateUserService', () => {
  let service: CreateUserServiceImpl;
  beforeAll(async () => {
    const app = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        mongooseBoardModule,
        mongooseUserModule,
      ],
      providers: [CreateUserServiceImpl],
    }).compile();

    service = app.get<CreateUserServiceImpl>(CreateUserServiceImpl);
  });

  describe('when create a user', () => {
    describe('and the user is correctly inserted', () => {
      it('should return the user', async () => {
        const result = await service.create(mockedUser);
        expect(result.name).toEqual(mockedUser.name);
        expect(result.email).toEqual(mockedUser.email);
      });
    });
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
