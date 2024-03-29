import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { SlackCommunicationProducer } from '../producers/slack-communication.producer';
import { CommunicationServiceInterface } from '../interfaces/slack-communication.service.interface';
import { SlackCommunicationService } from './slack-communication.service';
import { SlackResponsibleProducer } from '../producers/slack-responsible.producer';
import { SlackMergeBoardProducer } from '../producers/slack-merge-board.producer';
import { SlackAddUserToChannelProducer } from '../producers/slack-add-user-channel.producer';
import { BoardTypeFactory } from 'src/libs/test-utils/mocks/factories/communication/boardType-factory.mock';
import { ConfigService } from '@nestjs/config';
import configService from 'src/libs/test-utils/mocks/configService.mock';
import mockedChangeResponsible from 'src/libs/test-utils/mocks/factories/communication/changeResponsible.mock';
import mockedMergeBoardType from 'src/libs/test-utils/mocks/factories/communication/mergeBoardType.mock';

describe('SlackCommunicationService', () => {
	let service: CommunicationServiceInterface;
	let slackArchiveChannelProducerMock: DeepMocked<SlackCommunicationProducer>;
	let slackResponsibleProducerMock: DeepMocked<SlackResponsibleProducer>;
	let slackMergeBoardProducerMock: DeepMocked<SlackMergeBoardProducer>;
	let slackAddUserToChannelProducerMock: DeepMocked<SlackAddUserToChannelProducer>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SlackCommunicationService,
				{
					provide: ConfigService,
					useValue: configService
				},
				{
					provide: SlackCommunicationProducer,
					useValue: createMock<SlackCommunicationProducer>()
				},
				{
					provide: SlackResponsibleProducer,
					useValue: createMock<SlackResponsibleProducer>()
				},
				{
					provide: SlackMergeBoardProducer,
					useValue: createMock<SlackMergeBoardProducer>()
				},
				{
					provide: SlackAddUserToChannelProducer,
					useValue: createMock<SlackAddUserToChannelProducer>()
				}
			]
		}).compile();

		service = module.get<SlackCommunicationService>(SlackCommunicationService);
		slackArchiveChannelProducerMock = module.get(SlackCommunicationProducer);
		slackResponsibleProducerMock = module.get(SlackResponsibleProducer);
		slackMergeBoardProducerMock = module.get(SlackMergeBoardProducer);
		slackAddUserToChannelProducerMock = module.get(SlackAddUserToChannelProducer);
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should call slackCommunicationProducer.add once with a boardType', async () => {
		const boardMock = BoardTypeFactory.create();
		await service.execute(boardMock);
		expect(slackArchiveChannelProducerMock.add).toHaveBeenNthCalledWith(1, boardMock);
	});

	it('should call slackResponsibleProducer.add once with a changeResponsibleType', async () => {
		await service.executeResponsibleChange(mockedChangeResponsible);
		expect(slackResponsibleProducerMock.add).toHaveBeenNthCalledWith(1, mockedChangeResponsible);
	});

	it('should call slackMergeBoardProducer.add once with MergeBoardType data', async () => {
		await service.executeMergeBoardNotification(mockedMergeBoardType);
		expect(slackMergeBoardProducerMock.add).toHaveBeenNthCalledWith(1, mockedMergeBoardType);
	});

	it('should call slackAddUserToChannelProducer.add once with AddUserMainChannelType', async () => {
		const emailMock = { email: 'someEmail@gmail.com' };
		await service.executeAddUserMainChannel(emailMock);
		expect(slackAddUserToChannelProducerMock.add).toHaveBeenNthCalledWith(1, emailMock);
	});
});
