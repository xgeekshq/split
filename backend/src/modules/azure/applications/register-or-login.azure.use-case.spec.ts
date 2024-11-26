import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { Test, TestingModule } from '@nestjs/testing';
import LoggedUserDto from 'src/modules/users/dto/logged.user.dto';
import { registerOrLoginUseCase } from '../azure.providers';
import { AUTH_AZURE_SERVICE } from '../constants';
import { AuthAzureServiceInterface } from '../interfaces/services/auth.azure.service.interface';
import { CREATE_USER_SERVICE, GET_USER_SERVICE } from 'src/modules/users/constants';
import { GetUserServiceInterface } from 'src/modules/users/interfaces/services/get.user.service.interface';
import { CreateUserServiceInterface } from 'src/modules/users/interfaces/services/create.user.service.interface';
import { GET_TOKEN_AUTH_SERVICE, UPDATE_USER_SERVICE } from 'src/modules/auth/constants';
import { UpdateUserServiceInterface } from 'src/modules/users/interfaces/services/update.user.service.interface';
import { GetTokenAuthServiceInterface } from 'src/modules/auth/interfaces/services/get-token.auth.service.interface';
import { STORAGE_SERVICE } from 'src/modules/storage/constants';
import { StorageServiceInterface } from 'src/modules/storage/interfaces/services/storage.service';
import { ConfigService } from '@nestjs/config';
import configService from 'src/libs/test-utils/mocks/configService.mock';
import { JwtService } from '@nestjs/jwt';

describe('RegisterOrLoginUserUseCase', () => {
	let registerOrLogin: UseCase<string, LoggedUserDto | null>;
	let authAzureServiceMock: DeepMocked<AuthAzureServiceInterface>;
	let getUserService: DeepMocked<GetUserServiceInterface>;
	let updateUserServiceMock: DeepMocked<UpdateUserServiceInterface>;
	let tokenServiceMock: DeepMocked<GetTokenAuthServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				registerOrLoginUseCase,
				{
					provide: AUTH_AZURE_SERVICE,
					useValue: createMock<AuthAzureServiceInterface>()
				},
				{
					provide: GET_USER_SERVICE,
					useValue: createMock<GetUserServiceInterface>()
				},
				{
					provide: CREATE_USER_SERVICE,
					useValue: createMock<CreateUserServiceInterface>()
				},
				{
					provide: UPDATE_USER_SERVICE,
					useValue: createMock<UpdateUserServiceInterface>()
				},
				{
					provide: GET_TOKEN_AUTH_SERVICE,
					useValue: createMock<GetTokenAuthServiceInterface>()
				},
				{
					provide: STORAGE_SERVICE,
					useValue: createMock<StorageServiceInterface>()
				},
				{
					provide: ConfigService,
					useValue: configService
				},
				{
					provide: JwtService,
					useValue: createMock<JwtService>()
				}
			]
		}).compile();

		registerOrLogin = module.get(registerOrLoginUseCase.provide);
		authAzureServiceMock = module.get(AUTH_AZURE_SERVICE);
		getUserService = module.get(GET_USER_SERVICE);
		updateUserServiceMock = module.get(UPDATE_USER_SERVICE);
		tokenServiceMock = module.get(GET_TOKEN_AUTH_SERVICE);
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.resetAllMocks();
	});

	it('should be defined', () => {
		expect(registerOrLogin).toBeDefined();
	});
	describe('execute', () => {
		it('should return null when validateAccessToken returns false', async () => {
			const spy = jest
				.spyOn(registerOrLogin, 'validateAccessToken' as any)
				.mockResolvedValueOnce(false);
			expect(await registerOrLogin.execute('')).toBe(null);
			spy.mockRestore();
		});
		it('should restore user when is deleted and signin normally', async () => {
			const spy = jest.spyOn(registerOrLogin, 'validateAccessToken' as any).mockResolvedValueOnce({
				unique_name: 'test',
				email: 'test@test.com',
				name: 'test',
				given_name: 'test',
				family_name: 'test'
			});
			authAzureServiceMock.getUserFromAzure.mockResolvedValueOnce({
				accountEnabled: true,
				deletedDateTime: null
			} as never);
			getUserService.getByEmail.mockResolvedValueOnce({
				_id: 'id',
				email: 'test@test.com',
				isDeleted: true
			} as never);
			tokenServiceMock.getTokens.mockResolvedValueOnce({} as never);
			expect(await registerOrLogin.execute('')).toHaveProperty('email', 'test@test.com');
			expect(updateUserServiceMock.restoreUser).toHaveBeenCalled();
			spy.mockRestore();
		});
		it('should singIn the user', async () => {
			const spy = jest.spyOn(registerOrLogin, 'validateAccessToken' as any).mockResolvedValueOnce({
				unique_name: 'test',
				email: 'test@test.com',
				name: 'test',
				given_name: 'test',
				family_name: 'test'
			});
			authAzureServiceMock.getUserFromAzure.mockResolvedValueOnce({
				accountEnabled: true,
				deletedDateTime: null
			} as never);
			getUserService.getByEmail.mockResolvedValueOnce({
				_id: 'id',
				email: 'test@test.com',
				isDeleted: false
			} as never);
			tokenServiceMock.getTokens.mockResolvedValueOnce({} as never);
			expect(await registerOrLogin.execute('')).toHaveProperty('email', 'test@test.com');
			spy.mockRestore();
		});
	});
});
