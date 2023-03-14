import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { TYPES } from 'src/modules/communication/interfaces/types';
import { AddUserMainChannelType } from '../dto/types';
import { Job } from 'bull';
import { SlackAddUserToChannelConsumer } from './slack-add-user-channel.consumer';
import { AddUserIntoChannelApplicationInterface } from '../interfaces/communication.application.interface copy';
import { Logger } from '@nestjs/common';

const changeResponsibleMock = {
	id: 1,
	data: {
		email: 'someEmail@gmail.com'
	}
};

describe('SlackResponsibleConsumer', () => {
	let consumer: SlackAddUserToChannelConsumer;
	let addUserIntoChannelAppMock: DeepMocked<AddUserIntoChannelApplicationInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				SlackAddUserToChannelConsumer,
				{
					provide: TYPES.application.SlackAddUserIntoChannelApplication,
					useValue: createMock<AddUserIntoChannelApplicationInterface>()
				}
			]
		}).compile();
		consumer = module.get<SlackAddUserToChannelConsumer>(SlackAddUserToChannelConsumer);
		addUserIntoChannelAppMock = module.get(TYPES.application.SlackAddUserIntoChannelApplication);
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	it('should be defined', () => {
		expect(consumer).toBeDefined();
	});

	describe('communication', () => {
		it('should call sendMessageApplication.execute once with job.data', async () => {
			await consumer.communication(changeResponsibleMock as unknown as Job<AddUserMainChannelType>);
			expect(addUserIntoChannelAppMock.execute).toHaveBeenNthCalledWith(
				1,
				changeResponsibleMock.data.email
			);
		});
	});

	describe('onCompleted', () => {
		it('should call Logger with string containing a email ', async () => {
			const spyLogger = jest.spyOn(Logger.prototype, 'verbose');
			const result: boolean[] = [true];
			await consumer.onCompleted(
				changeResponsibleMock as unknown as Job<AddUserMainChannelType>,
				result
			);
			expect(spyLogger).toHaveBeenNthCalledWith(1, expect.stringContaining('someEmail@gmail.com'));
		});
	});
});
