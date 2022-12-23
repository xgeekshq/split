import { IsMongoId, IsOptional } from 'class-validator';

export class UserTeamsParams {
	@IsMongoId()
	@IsOptional()
	userId?: string;

	@IsMongoId()
	@IsOptional()
	teamId?: string;
}
