import { TeamUserFactory } from 'src/libs/test-utils/mocks/factories/teamUser-factory.mock';
import { faker } from '@faker-js/faker';
import { deleteTeamUserUseCase } from '../teamusers.providers';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import * as TeamUsers from 'src/modules/teamUsers/interfaces/types';
import { TeamUserRepositoryInterface } from 'src/modules/teamUsers/interfaces/repositories/team-user.repository.interface';
import TeamUser from '../entities/team.user.schema';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';

const removeTeamUser: string = faker.datatype.uuid();
const deletedTeamUser: TeamUser = TeamUserFactory.create({ _id: removeTeamUser });

describe('DeleteTeamUserUseCase', () => {
	let deleteTeamUser: UseCase<string, TeamUser>;
	let teamUserRepositoryMock: DeepMocked<TeamUserRepositoryInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				deleteTeamUserUseCase,
				{
					provide: TeamUsers.TYPES.repositories.TeamUserRepository,
					useValue: createMock<TeamUserRepositoryInterface>()
				}
			]
		}).compile();

		deleteTeamUser = module.get<UseCase<string, TeamUser>>(deleteTeamUserUseCase.provide);
		teamUserRepositoryMock = module.get(TeamUsers.TYPES.repositories.TeamUserRepository);
	});

	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(deleteTeamUser).toBeDefined();
	});

	describe('execute', () => {
		it('should delete team user', async () => {
			teamUserRepositoryMock.deleteTeamUser.mockResolvedValue(deletedTeamUser);
			await expect(deleteTeamUser.execute(removeTeamUser)).resolves.toEqual(deletedTeamUser);
		});

		it('should throw error when team user is not deleted', async () => {
			teamUserRepositoryMock.deleteTeamUser.mockResolvedValue(null);
			await expect(async () => deleteTeamUser.execute(removeTeamUser)).rejects.toThrowError(
				BadRequestException
			);
		});
	});
});
