import { IsOptional } from 'class-validator';

export class BaseParamWSocket {
	@IsOptional()
	socketId?: string;
}
