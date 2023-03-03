export class SlackMessageDto {
	slackChannelId!: string;
	message!: string;

	constructor(slackChannelId: string, message: string) {
		this.slackChannelId = slackChannelId;
		this.message = message;
	}
}
