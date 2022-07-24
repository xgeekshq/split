import { Logger } from '@nestjs/common';
import { DoneCallback, Job } from 'bull';

import { SlackCommunicationGateAdapter } from 'modules/communication/adapters/slack-communication-gate.adapter';
import { SlackExecuteCommunication } from 'modules/communication/applications/slack-execute-communication.application';
import { ConfigurationType, JobType } from 'modules/communication/dto/types';
import { ChatSlackHandler } from 'modules/communication/handlers/chat-slack.handler';
import { ConversationsSlackHandler } from 'modules/communication/handlers/conversations-slack.handler';
import { UsersSlackHandler } from 'modules/communication/handlers/users-slack.handler';

// eslint-disable-next-line func-names
export default async function (job: Job<JobType>, cb: DoneCallback) {
	Logger.verbose(`${JSON.stringify(job.id)} (pid ${process.pid})`);

	const data = job.data;
	const board = data.board;
	const config: ConfigurationType = data.config;

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
