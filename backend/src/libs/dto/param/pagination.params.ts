import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginationParams {
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	@Min(0)
	page?: number;

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	@Min(1)
	size?: number;

	@IsOptional()
	@Type(() => String)
	searchUser?: string;

	@IsOptional()
	@Type(() => String)
	team?: string;
}
