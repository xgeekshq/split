export interface ChatHandlerInterface {
  postMessage(
    channelId: string,
    text: string,
  ): Promise<{ ok: boolean; channel?: string }>;
}
