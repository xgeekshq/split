import { FRONTEND_URL } from 'libs/constants/frontend';

import {
	SLACK_API_BOT_TOKEN,
	SLACK_CHANNEL_PREFIX,
	SLACK_MASTER_CHANNEL_ID
} from '../../constants/slack';

const configService = {
	get(key: string) {
		switch (key) {
			case 'JWT_ACCESS_TOKEN_EXPIRATION_TIME':
				return '3600';
			default:
				return 'UNKNOWN';
		}
	},
	getOrThrow(key: string) {
		switch (key) {
			case 'JWT_ACCESS_TOKEN_EXPIRATION_TIME':
				return '3600';
			case SLACK_API_BOT_TOKEN:
				return 'ANY_SLACK_API_BOT_TOKEN';
			case SLACK_MASTER_CHANNEL_ID:
				return 'ANY_SLACK_CHANNEL_ID';
			case SLACK_CHANNEL_PREFIX:
				return 'ANY_PREFIX_';
			case FRONTEND_URL:
				return 'ANY_FRONTEND_URL';
			default:
				return 'UNKNOWN';
		}
	}
};

export default configService;
