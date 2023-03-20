import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BoardTypeFactory } from 'src/libs/test-utils/mocks/factories/communication/boardType-factory.mock';
import { CommunicationServiceInterface } from '../interfaces/slack-communication.service.interface';
import { SlackDisabledCommunicationService } from './slack-disabled-communication.service';

const spyLoggerWarn = jest.spyOn(Logger.prototype, 'warn').mockImplementation(jest.fn);

describe('SlackDisabledCommunicationService', () => {
	let service: CommunicationServiceInterface;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [SlackDisabledCommunicationService]
		}).compile();

		service = module.get<SlackDisabledCommunicationService>(SlackDisabledCommunicationService);
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should call logger warning if executeResponsibleChange is called', async () => {
		const changeResponsible = {
			newResponsibleEmail: 'someEmail@gmail.com',
			previousResponsibleEmail: 'someEmail@gmail.com',
			subTeamChannelId: 'someId',
			email: 'someEmail',
			teamNumber: 1,
			responsiblesChannelId: 'someChannelId',
			mainChannelId: 'mainChannelId'
		};

		await service.executeResponsibleChange(changeResponsible);

		expect(spyLoggerWarn).toHaveBeenNthCalledWith(
			1,
			expect.stringContaining(JSON.stringify(changeResponsible))
		);
	});

	it('should call logger warning if executeMergeBoardNotification is called', async () => {
		const mergeBoardTypeMock = {
			teamNumber: 1,
			responsiblesChannelId: 'someId',
			isLastSubBoard: true,
			boardId: 'someId',
			mainBoardId: 'someId'
		};

		await service.executeMergeBoardNotification(mergeBoardTypeMock);

		expect(spyLoggerWarn).toHaveBeenNthCalledWith(
			1,
			expect.stringContaining(JSON.stringify(mergeBoardTypeMock))
		);
	});

	it('should call logger warning if executeAddUserMainChannel is called', async () => {
		const emailMock = { email: 'someEmail@gmail.com' };

		await service.executeAddUserMainChannel(emailMock);

		expect(spyLoggerWarn).toHaveBeenNthCalledWith(
			1,
			expect.stringContaining(JSON.stringify(emailMock.email))
		);
	});

	it('should call logger warning if execute is called', async () => {
		const boardMock = BoardTypeFactory.create();

		await service.execute(boardMock);
		expect(spyLoggerWarn).toHaveBeenNthCalledWith(
			1,
			expect.stringContaining(JSON.stringify(boardMock))
		);
	});
});
