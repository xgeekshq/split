import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { ResponsibleApplicationInterface } from '../interfaces/responsible.application.interface';
import { TYPES } from 'src/modules/communication/interfaces/types';
import { SlackResponsibleConsumer } from './slack-responsible.consumer';
import { ChangeResponsibleType } from '../dto/types';
import { Job } from 'bull';

const changeResponsibleMock = {
	id: 1,
	data: {
		newResponsibleEmail: 'newResponsible@gmail.com',
		previousResponsibleEmail: 'previousResponsible@gmail.com',
		subTeamChannelId: 'C99CQSJC1M5',
		email: 'someEmail@gmail.com',
		teamNumber: 2,
		responsiblesChannelId: 'C03CLDK1M2',
		mainChannelId: 'C03CQSJC1M2'
	}
};

describe('SlackResponsibleConsumer', () => {
	let consumer: SlackResponsibleConsumer;
	let responsibleApplicationMock: DeepMocked<ResponsibleApplicationInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SlackResponsibleConsumer,
				{
					provide: TYPES.application.SlackResponsibleApplication,
					useValue: createMock<ResponsibleApplicationInterface>
				}
			]
		}).compile();
		consumer = module.get<SlackResponsibleConsumer>(SlackResponsibleConsumer);
		responsibleApplicationMock = module.get(TYPES.application.SlackResponsibleApplication);
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(consumer).toBeDefined();
	});

	it('should call sendMessageApplication.execute once with job.data', async () => {
		await consumer.communication(changeResponsibleMock as unknown as Job<ChangeResponsibleType>);
		expect(responsibleApplicationMock.execute).toHaveBeenNthCalledWith(
			1,
			changeResponsibleMock.data
		);
	});
});
