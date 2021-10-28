import { Test, TestingModule } from '@nestjs/testing';
import { UserEntity } from '../entity/user.entity';
import { UsersService } from '../users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { mockedUser } from '../../mocks/user.mock';

const createUserDto = {
  email: 'user@email.com',
  username: 'John',
  password: 'hash',
};

describe('UsersService', () => {
  let usersService: UsersService;

  let findOne: jest.Mock;

  let repo: Repository<UserEntity>;
  beforeEach(async () => {
    findOne = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne,
            create: jest.fn().mockResolvedValue(mockedUser),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    repo = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  });

  describe('when getting a user by email', () => {
    describe('and the user is matched', () => {
      let user: UserEntity;
      beforeEach(() => {
        user = new UserEntity();
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
        await expect(
          usersService.getByEmail('test@test.com'),
        ).rejects.toThrow();
      });
    });
  });

  describe('when create a user', () => {
    describe('and the user is correctly inserted', () => {
      it('should return the user', async () => {
        const result = await usersService.create(createUserDto);
        expect(repo.create).toHaveBeenCalledWith(createUserDto);
        expect(result).toEqual(mockedUser);
      });
    });
  });
});
