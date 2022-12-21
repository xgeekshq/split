import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class UserTeamsParams {
	@IsMongoId()
	@IsString()
	@IsOptional()
	userId?: string;
}
