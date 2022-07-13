/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-classes-per-file */
import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Document, LeanDocument } from 'mongoose';

import GetBoardServiceImpl from '../../src/modules/boards/services/get.board.service';
import { getTeamService } from '../../src/modules/teams/providers';
import Board from '../../src/modules/boards/schemas/board.schema';

describe('GetBoardServiceImpl', () => {
  let service: GetBoardServiceImpl;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        getTeamService,
        {
          provide: getModelToken('Team'),
          useValue: {},
        },
        {
          provide: getModelToken('TeamUser'),
          useValue: {},
        },
        {
          provide: getModelToken('Board'),
          useValue: {},
        },
        {
          provide: getModelToken('BoardUser'),
          useValue: {},
        },
        GetBoardServiceImpl,
      ],
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
                  votes: [
                    { _id: 'any_id_1' },
                    { _id: 'any_id_1' },
                    { _id: 'any_id_2' },
                    { _id: 'any_id_2' },
                    { _id: 'any_id_3' },
                  ],
                },
              ],
              votes: [{ _id: 'any_id_1' }, { _id: 'any_id_2' }],
            },
          ],
        },
        {
          cards: [
            {
              items: [
                {
                  votes: [],
                },
                {
                  votes: [],
                },
              ],
              votes: ['any_id_4'],
            },
          ],
        },
        {
          cards: [],
        },
      ],
      hideVotes: true,
    } as unknown as LeanDocument<
      Board & Document<any, any, any> & { _id: any }
    >;
    const userId = 'any_id_1';

    // eslint-disable-next-line @typescript-eslint/dot-notation
    const result = service['cleanVotes'](userId, boardGiven);

    expect(result).toMatchObject({
      columns: [
        {
          cards: [
            {
              items: [
                {
                  votes: [{ _id: 'any_id_1' }, { _id: 'any_id_1' }],
                },
              ],
              votes: [{ _id: 'any_id_1' }],
            },
          ],
        },
        {
          cards: [{ items: [{ votes: [] }, { votes: [] }], votes: [] }],
        },
        { cards: [] },
      ],
      hideVotes: true,
    });
  });
});
