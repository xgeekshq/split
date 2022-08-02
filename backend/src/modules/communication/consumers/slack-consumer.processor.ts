import { Logger } from '@nestjs/common';
import { DoneCallback, Job } from 'bull';

import { SlackCommunicationGateAdapter } from 'modules/communication/adapters/slack-communication-gate.adapter';
import { SlackExecuteCommunication } from 'modules/communication/applications/slack-execute-communication.application';
import { ConfigurationType, JobType } from 'modules/communication/dto/types';
import { ChatSlackHandler } from 'modules/communication/handlers/chat-slack.handler';
import { ConversationsSlackHandler } from 'modules/communication/handlers/conversations-slack.handler';
import { UsersSlackHandler } from 'modules/communication/handlers/users-slack.handler';

const logger = new Logger('CommunicationConsumerProcessor');

// If any error occurs the error will propagate and will be captured on queue's events
// it is not necessary use the "cb" to deal with the Errors
export default async function consumer(job: Job<JobType>, cb: DoneCallback) {
	const data = job.data;
	const board = data.board;
	const config: ConfigurationType = data.config;

	logger.verbose(
		`execute communication for board with id: "${data.board.id}" and Job id: "${job.id}" (pid ${process.pid})`
	);

	const communicationGateAdapter = new SlackCommunicationGateAdapter(config);
	const conversationsHandler = new ConversationsSlackHandler(communicationGateAdapter);
	const usersHandler = new UsersSlackHandler(communicationGateAdapter);
	const chatHandler = new ChatSlackHandler(communicationGateAdapter);
	const application = new SlackExecuteCommunication(
		config,
		conversationsHandler,
		usersHandler,
		chatHandler
	);
	const result = await application.execute(board);
	cb(null, result);
}
