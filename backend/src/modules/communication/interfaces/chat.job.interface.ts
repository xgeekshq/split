export interface ChatJobInterface {
	postMessage(channelId: string, text: string): Promise<{ ok: boolean; channel?: string }>;
}
