import { EventEmitter2 } from '@nestjs/event-emitter';
import jwtService from 'src/libs/test-utils/mocks/jwtService.mock';
import { ConfigService } from '@nestjs/config';
import { boardUserRepository, createBoardUserService } from './../boards.providers';
import { JwtService } from '@nestjs/jwt';
import { getTokenAuthService } from './../../auth/auth.providers';
import { Logger } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Document, LeanDocument } from 'mongoose';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import Board from 'src/modules/boards/entities/board.schema';
import {
	getTeamService,
	teamRepository,
	teamUserRepository,
	updateTeamService
} from 'src/modules/teams/providers';
import { updateUserService, userRepository } from 'src/modules/users/users.providers';
import { boardRepository, getBoardService } from '../boards.providers';
import { cleanBoard } from '../utils/clean-board';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';
import GetBoardService from 'src/modules/boards/services/get.board.service';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fakeBoards = BoardFactory.createMany(2);

describe('GetBoardService', () => {
	let service: GetBoardService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				createBoardUserService,
				updateUserService,
				ConfigService,
				getTokenAuthService,
				getTeamService,
				getBoardService,
				teamUserRepository,
				teamRepository,
				boardRepository,
				updateTeamService,
				userRepository,
				boardUserRepository,
				SocketGateway,
				EventEmitter2,
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
				{
					provide: getModelToken('ResetPassword'),
					useValue: {}
				},
				{
					provide: JwtService,
					useValue: jwtService
				},
				GetBoardService
			]
		}).compile();

		service = module.get<GetBoardService>(GetBoardService);
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
