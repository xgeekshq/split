import { ArchiveChannelData, ArchiveChannelResult } from 'src/modules/communication/dto/types';

export interface ArchiveChannelApplicationInterface {
	execute(data: ArchiveChannelData): Promise<ArchiveChannelResult[]>;
}
