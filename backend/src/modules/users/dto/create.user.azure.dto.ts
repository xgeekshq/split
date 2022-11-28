import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export default class CreateUserAzureDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	firstName!: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	lastName!: string;

	@ApiProperty({ type: String, format: 'email' })
	@IsNotEmpty()
	@IsString()
	email!: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsDateString()
	userAzureCreatedAt!: string;
}
