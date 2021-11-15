import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '../../users/users.service';
import { AuthController } from '../auth.controller';
import UserEntity from '../../users/entity/user.entity';
import { mockedUser } from '../../mocks/user.mock';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtService from '../../mocks/jwtService.mock';
import configService from '../../mocks/configService.mock';
import * as request from 'supertest';

describe('AuthController', () => {
  let app: INestApplication;
  let userData: UserEntity;

  beforeEach(async () => {
    const usersRepository = {
      create: jest.fn().mockResolvedValue(mockedUser),
      save: jest.fn().mockReturnValue(Promise.resolve()),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        UsersService,
        AuthService,
        ConfigService,
        {
          provide: ConfigService,
          useValue: configService,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: usersRepository,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('when registering', () => {
    describe('and using valid data', () => {
      it('should respond with the data of the user without the password', async () => {
        const expectedData = {
          ...userData,
        };
        delete expectedData.password;
        return await request(app.getHttpServer())
          .post('/auth/register')
          .send({
            email: mockedUser.email,
            name: mockedUser.name,
            password: '1!Aab2CD',
          })
          .expect(201);
      });
    });
    describe('and using invalid data', () => {
      it('should throw an error because full data wasnt submitted', async () => {
        return await request(app.getHttpServer())
          .post('/auth/register')
          .send({
            name: '',
            password: '',
            email: '',
          })
          .expect(400);
      });
      it('should throw an error because full data wasnt submitted', async () => {
        return await request(app.getHttpServer())
          .post('/auth/register')
          .send({
            name: mockedUser.name,
          })
          .expect(400);
      });
      it('should throw an error because full data wasnt submitted', async () => {
        return await request(app.getHttpServer())
          .post('/auth/register')
          .send({
            name: mockedUser.name,
            password: mockedUser.password,
          })
          .expect(400);
      });
      it('should throw an error because password is short', async () => {
        const res = await request(app.getHttpServer())
          .post('/auth/register')
          .send({
            name: mockedUser.name,
            password: '1234',
            email: mockedUser.email,
          });

        expect(res.body.message[0]).toBe(
          'Password too weak. Must have 1 uppercase, 1 lowercase, 1 number and 1 special character',
        );
      });
    });
  });
});
