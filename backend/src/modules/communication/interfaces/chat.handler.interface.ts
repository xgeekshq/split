export interface ChatHandlerInterface {
	postMessage(
		channelId: string,
		text: string,
		mainChannelId?: string,
		timeStamp?: string
	): Promise<{ ok: boolean; channel?: string }>;
}
