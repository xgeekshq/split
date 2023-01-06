import { Injectable } from '@nestjs/common';
import { ArchiveChannelResult, BoardType } from 'src/modules/communication/dto/types';
import { ArchiveChannelApplicationInterface } from 'src/modules/communication/interfaces/archive-channel.application.interface';
import { ArchiveChannelServiceInterface } from 'src/modules/communication/interfaces/archive-channel.service.interface';

@Injectable()
export class SlackArchiveChannelService implements ArchiveChannelServiceInterface {
	constructor(private application: ArchiveChannelApplicationInterface) {}

	public async execute(
		arg: BoardType | string,
		cascate?: boolean
	): Promise<ArchiveChannelResult[]> {
		return this.application.execute(arg, cascate);
	}
}
