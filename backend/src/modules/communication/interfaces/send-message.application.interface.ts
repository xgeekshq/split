import { SlackMessageType } from '../dto/types';

export interface SendMessageApplicationInterface {
	execute(data: SlackMessageType): Promise<void>;
}
