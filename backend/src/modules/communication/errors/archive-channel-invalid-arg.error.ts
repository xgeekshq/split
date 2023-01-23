export class ArchiveChannelInvalidArgError extends Error {
	constructor() {
		super('Invalid argument. Valid types are: string or BoardType');
	}
}
