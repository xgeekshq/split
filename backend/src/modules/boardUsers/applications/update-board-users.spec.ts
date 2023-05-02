import { Test, TestingModule } from '@nestjs/testing';
import { BoardUserFactory } from 'src/libs/test-utils/mocks/factories/boardUser-factory.mock';
import { UpdateBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/update.board.user.service.interface';
import { BoardRoles } from 'src/libs/enum/board.roles';
import { BoardUserDtoFactory } from 'src/libs/test-utils/mocks/factories/dto/boardUserDto-factory.mock';
import { UpdateFailedException } from 'src/libs/exceptions/updateFailedBadRequestException';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { BoardParticipantsPresenter, UpdateBoardUsersUseCase } from './update-board-users.use-case';
import UpdateBoardUserDto from 'src/modules/boardUsers/dto/update-board-user.dto';
import { CreateBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/create.board.user.service.interface';
import { DeleteBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/delete.board.user.service.interface';
import {
	CREATE_BOARD_USER_SERVICE,
	DELETE_BOARD_USER_SERVICE,
	UPDATE_BOARD_USER_SERVICE
} from 'src/modules/boardUsers/constants';

const addUsers = BoardUserDtoFactory.createMany(2);
const boardUserToRemove = BoardUserFactory.create();
const removedUsers = [boardUserToRemove._id];
const boardUserDto = BoardUserDtoFactory.create({ role: BoardRoles.MEMBER });

describe('UpdateBoardUsersUseCase', () => {
	let useCase: UseCase<UpdateBoardUserDto, BoardParticipantsPresenter>;
	let updateBoardUserServiceMock: DeepMocked<UpdateBoardUserServiceInterface>;
	let createBoardUserServiceMock: DeepMocked<CreateBoardUserServiceInterface>;
	let deleteBoardUserServiceMock: DeepMocked<DeleteBoardUserServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UpdateBoardUsersUseCase,
				{
					provide: CREATE_BOARD_USER_SERVICE,
					useValue: createMock<CreateBoardUserServiceInterface>()
				},
				{
					provide: DELETE_BOARD_USER_SERVICE,
					useValue: createMock<DeleteBoardUserServiceInterface>()
				},
				{
					provide: UPDATE_BOARD_USER_SERVICE,
					useValue: createMock<UpdateBoardUserServiceInterface>()
				}
			]
		}).compile();

		useCase = module.get(UpdateBoardUsersUseCase);
		updateBoardUserServiceMock = module.get(UPDATE_BOARD_USER_SERVICE);
		createBoardUserServiceMock = module.get(CREATE_BOARD_USER_SERVICE);
		deleteBoardUserServiceMock = module.get(DELETE_BOARD_USER_SERVICE);
	});

	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(useCase).toBeDefined();
	});

	describe('execute', () => {
		describe('updateBoardParticipants', () => {
			it('should throw an error when the inserting of board users fails', async () => {
				const removedUsers = [];

				createBoardUserServiceMock.saveBoardUsers.mockRejectedValueOnce('Error inserting users');
				expect(
					async () =>
						await useCase.execute({ addBoardUsers: addUsers, removeBoardUsers: removedUsers })
				).rejects.toThrowError(UpdateFailedException);
			});

			it('should throw an error when the deleting of board users fails', async () => {
				deleteBoardUserServiceMock.deleteBoardUsers.mockResolvedValueOnce(0);
				expect(
					async () =>
						await useCase.execute({ addBoardUsers: addUsers, removeBoardUsers: removedUsers })
				).rejects.toThrowError(UpdateFailedException);
			});

			it('should return the created boardUsers', async () => {
				const saveBoardUsersResult = BoardUserFactory.createMany(2, [
					{
						_id: addUsers[0]._id,
						role: addUsers[0].role,
						user: addUsers[0].user,
						board: addUsers[0].board
					},
					{
						_id: addUsers[1]._id,
						role: addUsers[1].role,
						user: addUsers[1].user,
						board: addUsers[1].board
					}
				]);

				createBoardUserServiceMock.saveBoardUsers.mockResolvedValueOnce(saveBoardUsersResult);
				deleteBoardUserServiceMock.deleteBoardUsers.mockResolvedValueOnce(1);

				const boardUsersCreatedResult = await useCase.execute({
					addBoardUsers: addUsers,
					removeBoardUsers: removedUsers
				});
				expect(boardUsersCreatedResult).toEqual(saveBoardUsersResult);
			});
		});

		describe('updateBoardParticipantsRole', () => {
			it('should throw an error if the updateBoardUserRole fails', async () => {
				updateBoardUserServiceMock.updateBoardUserRole.mockResolvedValueOnce(null);

				expect(
					async () =>
						await useCase.execute({
							boardUserToUpdateRole: boardUserDto,
							addBoardUsers: [],
							removeBoardUsers: []
						})
				).rejects.toThrowError(UpdateFailedException);
			});

			it('should return the boardUser with the updated role', async () => {
				const boardUserUpdated = BoardUserFactory.create({
					_id: boardUserDto._id,
					role: BoardRoles.RESPONSIBLE,
					user: boardUserDto.user,
					board: boardUserDto.board
				});

				updateBoardUserServiceMock.updateBoardUserRole.mockResolvedValueOnce(boardUserUpdated);

				const boardUserResult = await useCase.execute({
					boardUserToUpdateRole: boardUserDto,
					addBoardUsers: [],
					removeBoardUsers: []
				});

				expect(boardUserResult).toEqual(boardUserUpdated);
			});
		});
	});
});
