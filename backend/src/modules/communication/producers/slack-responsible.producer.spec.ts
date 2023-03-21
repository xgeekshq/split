import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Queue } from 'bull';
import { getQueueToken } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { SlackResponsibleProducer } from './slack-responsible.producer';
import mockedChangeResponsible from 'src/libs/test-utils/mocks/factories/communication/changeResponsible.mock';

describe('SlackResponsibleProducer', () => {
	let producer: SlackResponsibleProducer;
	let queueMock: DeepMocked<Queue>;

	const spyLoggerVerbose = jest.spyOn(Logger.prototype, 'verbose').mockImplementation(jest.fn);

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SlackResponsibleProducer,
				{
					provide: getQueueToken(SlackResponsibleProducer.name),
					useValue: createMock<Queue>()
				}
			]
		}).compile();
		producer = module.get<SlackResponsibleProducer>(SlackResponsibleProducer);
		queueMock = module.get(getQueueToken(SlackResponsibleProducer.name));
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(producer).toBeDefined();
	});

	it('should add changeResponsibleType to queue', async () => {
		await producer.add(mockedChangeResponsible);
		expect(queueMock.add).toHaveBeenNthCalledWith(1, mockedChangeResponsible);
	});

	it('should call logger and containt team number', async () => {
		await producer.add(mockedChangeResponsible);

		expect(spyLoggerVerbose).toHaveBeenNthCalledWith(
			1,
			expect.stringContaining(mockedChangeResponsible.teamNumber.toString())
		);
	});
});
