import { SlackMessageType, SlackPostMessageResult } from '../dto/types';

export interface SendMessageApplicationInterface {
	execute(data: SlackMessageType): Promise<SlackPostMessageResult>;
}
