import { ArchiveChannelResult, BoardType } from '../dto/types';

export interface ArchiveChannelServiceInterface {
	execute(arg: BoardType | string, cascate: boolean): Promise<ArchiveChannelResult[]>;
}
