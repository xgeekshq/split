import { TeamUserFactory } from 'src/libs/test-utils/mocks/factories/teamUser-factory.mock';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { TeamUserRepositoryInterface } from 'src/modules/teamUsers/interfaces/repositories/team-user.repository.interface';
import TeamUser from '../entities/team.user.schema';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { DeleteTeamUserUseCase } from 'src/modules/teamUsers/applications/delete-team-user.use-case';
import { TEAM_USER_REPOSITORY } from 'src/modules/teamUsers/constants';

const removeTeamUser: string = faker.string.uuid();
const deletedTeamUser: TeamUser = TeamUserFactory.create({ _id: removeTeamUser });

describe('DeleteTeamUserUseCase', () => {
	let deleteTeamUser: UseCase<string, TeamUser>;
	let teamUserRepositoryMock: DeepMocked<TeamUserRepositoryInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				DeleteTeamUserUseCase,
				{
					provide: TEAM_USER_REPOSITORY,
					useValue: createMock<TeamUserRepositoryInterface>()
				}
			]
		}).compile();

		deleteTeamUser = module.get(DeleteTeamUserUseCase);
		teamUserRepositoryMock = module.get(TEAM_USER_REPOSITORY);
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
