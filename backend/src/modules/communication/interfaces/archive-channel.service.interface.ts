import { ArchiveChannelData } from '../dto/types';

export interface ArchiveChannelServiceInterface {
	execute(data: ArchiveChannelData): Promise<void>;
}
