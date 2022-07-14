import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class UserDto {
	@IsNotEmpty()
	@IsMongoId()
	@IsString()
	@IsMongoId()
	_id!: string;

	@IsNotEmpty()
	@IsString()
	firstName!: string;

	@IsNotEmpty()
	@IsString()
	lastName!: string;

	@IsNotEmpty()
	@IsString()
	email!: string;

	@IsNotEmpty()
	@IsString()
	strategy!: string;

	@IsOptional()
	isSAdmin?: boolean;
}
