import { ArchiveChannelResult, BoardType } from 'src/modules/communication/dto/types';

export interface ArchiveChannelApplicationInterface {
	execute(arg: BoardType | string, cascade: boolean): Promise<ArchiveChannelResult[]>;
}
