import { SlackMessageType } from '../dto/types';

export interface SendMessageServiceInterface {
	execute(data: SlackMessageType): Promise<void>;
}
