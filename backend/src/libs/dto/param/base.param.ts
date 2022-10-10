import { IsMongoId, IsOptional } from 'class-validator';

export class BaseParam {
	@IsMongoId()
	boardId!: string;
}

export class BaseParamWSocket extends BaseParam {
	@IsOptional()
	socketId?: string;
}
