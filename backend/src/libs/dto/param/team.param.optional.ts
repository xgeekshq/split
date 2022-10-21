import { IsOptional } from 'class-validator';

export class TeamParamOptional {
	@IsOptional()
	teamId?: string;
}
