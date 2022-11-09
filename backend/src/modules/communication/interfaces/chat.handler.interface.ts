export interface ChatHandlerInterface {
	postMessage(
		channelId: string,
		text: string,
		timeStamp?: string
	): Promise<{ ok: boolean; channel?: string }>;
}
