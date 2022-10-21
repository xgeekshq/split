import { IsOptional } from 'class-validator';

export class TeamParam {
	@IsOptional()
	teamId?: string;
}
