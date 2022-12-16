import { IsMongoId, IsString } from 'class-validator';

export class UserParams {
	@IsMongoId()
	@IsString()
	userId!: string;
}
