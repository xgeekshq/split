/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-classes-per-file */
import { Logger } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Document, LeanDocument, Types } from 'mongoose';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import Board from 'src/modules/boards/entities/board.schema';
import GetBoardServiceImpl from 'src/modules/boards/services/get.board.service';
import {
	getTeamService,
	teamRepository,
	teamUserRepository,
	updateTeamService
} from 'src/modules/teams/providers';
import { userRepository } from 'src/modules/users/users.providers';
import { boardRepository, boardUserRepository, getBoardService } from '../boards.providers';
import { cleanBoard } from '../utils/clean-board';

const fakeBoards = BoardFactory.createMany(2);

describe('GetBoardServiceImpl', () => {
	let service: GetBoardServiceImpl;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				getTeamService,
				getBoardService,
				teamUserRepository,
				teamRepository,
				boardRepository,
				boardUserRepository,
				updateTeamService,
				userRepository,
				{
					provide: getModelToken('Team'),
					useValue: {}
				},
				{
					provide: getModelToken('TeamUser'),
					useValue: {}
				},
				{
					provide: getModelToken(Board.name),
					useValue: {}
				},
				{
					provide: getModelToken('BoardUser'),
					useValue: {}
				},
				{
					provide: getModelToken('User'),
					useValue: {}
				},
				GetBoardServiceImpl
			]
		}).compile();

		service = module.get<GetBoardServiceImpl>(GetBoardServiceImpl);
		jest.spyOn(Logger.prototype, 'error').mockImplementation(jest.fn);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should keep votes only for one user by userId', () => {
		const boardGiven = {
			columns: [
				{
					cards: [
						{
							items: [
								{
									votes: ['any_id_1', 'any_id_2']
								}
							],
							votes: ['any_id_1']
						}
					]
				},
				{
					cards: [
						{
							items: [
								{
									votes: []
								},
								{
									votes: []
								}
							],
							votes: ['any_id_4']
						}
					]
				},
				{
					cards: []
				}
			],
			hideVotes: true
		} as unknown as LeanDocument<Board & Document<any, any, any> & { _id: any }>;
		const userId = 'any_id_1';

		const result = cleanBoard(boardGiven as Board, userId);

		expect(result).toMatchObject({
			columns: [
				{
					cards: [
						{
							items: [
								{
									votes: []
								}
							],
							votes: []
						}
					]
				},
				{
					cards: [{ items: [{ votes: [] }, { votes: [] }], votes: [] }]
				},
				{ cards: [] }
			],
			hideVotes: true
		});
	});
});
