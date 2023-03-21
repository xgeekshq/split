import { Test, TestingModule } from '@nestjs/testing';
import { CreateCardServiceInterface } from '../interfaces/services/create.card.service.interface';
import CreateCardService from './create.card.service';
import { TYPES } from '../interfaces/types';
import { createMock } from '@golevelup/ts-jest';
import { CardRepositoryInterface } from '../repository/card.repository.interface';

describe('CreateCardService', () => {
	let service: CreateCardServiceInterface;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CreateCardService,
				{
					provide: TYPES.repository.CardRepository,
					useValue: createMock<CardRepositoryInterface>()
				}
			]
		}).compile();
		service = module.get<CreateCardServiceInterface>(CreateCardService);
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
