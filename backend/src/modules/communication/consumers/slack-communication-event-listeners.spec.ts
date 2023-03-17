import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Job } from 'bull';
import { BoardType } from '../dto/types';
import { SlackCommunicationEventListeners } from './slack-communication-event-listeners';
import { TeamDto } from 'src/modules/communication/dto/team.dto';

const BoardTypeMock = {
	id: 1,
	data: {}
};

describe('SlackCommunicationEventListeners', () => {
	let listener: SlackCommunicationEventListeners<BoardType, TeamDto>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [SlackCommunicationEventListeners]
		}).compile();
		listener = module.get<SlackCommunicationEventListeners<BoardType, TeamDto>>(
			SlackCommunicationEventListeners
		);

		listener.logger = new Logger();
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	it('should be defined', () => {
		expect(listener).toBeDefined();
	});

	it('should call logger.verbose onCompleted', () => {
		const spyLogger = jest.spyOn(Logger.prototype, 'verbose');
		listener.onCompleted(BoardTypeMock as unknown as Job<BoardType>, undefined);
		expect(spyLogger).toHaveBeenNthCalledWith(1, expect.stringContaining('1'));
	});

	it('should call logger.verbose onFailed', () => {
		const spyLogger = jest.spyOn(Logger.prototype, 'error').mockImplementation(jest.fn());
		listener.onFailed(BoardTypeMock as unknown as Job<BoardType>, 'someError');
		expect(spyLogger).toHaveBeenCalledTimes(1);
	});

	it('should call logger.error onError', () => {
		const spyLogger = jest.spyOn(Logger.prototype, 'error').mockImplementation(jest.fn());
		listener.onError(new Error('someError'));
		expect(spyLogger).toHaveBeenCalledTimes(1);
	});
});
