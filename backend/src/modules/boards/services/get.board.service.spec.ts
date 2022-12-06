/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-classes-per-file */
import { Logger } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Document, LeanDocument } from 'mongoose';
import Board from 'src/modules/boards/schemas/board.schema';
import GetBoardServiceImpl from 'src/modules/boards/services/get.board.service';
import { getTeamService, updateTeamService } from 'src/modules/teams/providers';
import { getBoardService } from '../boards.providers';

describe('GetBoardServiceImpl', () => {
	let service: GetBoardServiceImpl;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				getTeamService,
				getBoardService,
				updateTeamService,
				{
					provide: getModelToken('Team'),
					useValue: {}
				},
				{
					provide: getModelToken('TeamUser'),
					useValue: {}
				},
				{
					provide: getModelToken('Board'),
					useValue: {}
				},
				{
					provide: getModelToken('BoardUser'),
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

		// eslint-disable-next-line @typescript-eslint/dot-notation
		const result = service['cleanBoard'](boardGiven, userId);

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
