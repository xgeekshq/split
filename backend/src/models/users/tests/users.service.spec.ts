import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import User from '../schemas/user.schema';
import UsersService from '../users.service';
import mockedUser from '../../../mocks/user.mock';

describe('UsersService', () => {
  let usersService: UsersService;

  let findOne: jest.Mock;

  let repo: Model<User>;
  beforeEach(async () => {
    findOne = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: {
            findOne,
            create: jest.fn().mockResolvedValue(mockedUser),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    repo = module.get<Model<User>>(getModelToken('User'));
  });

  describe('when getting a user by email', () => {
    describe('and the user is matched', () => {
      let user: User;
      beforeEach(() => {
        user = new User();
        findOne.mockReturnValue(Promise.resolve(user));
      });
      it('should return the user', async () => {
        const fetchedUser = await usersService.getByEmail('test@test.com');
        expect(fetchedUser).toEqual(user);
      });
    });
    describe('and the user is not matched', () => {
      beforeEach(() => {
        findOne.mockReturnValue(undefined);
      });
      it('should throw an error', async () => {
        expect(await usersService.getByEmail('test@test.com')).toEqual(false);
      });
    });
  });

  describe('when create a user', () => {
    describe('and the user is correctly inserted', () => {
      it('should return the user', async () => {
        const result = await usersService.create(mockedUser);
        expect(repo.create).toHaveBeenCalledWith(mockedUser);
        expect(result).toEqual(mockedUser);
      });
    });
  });
});
