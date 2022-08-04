import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class EmailParam {
	@ApiProperty({ type: String, format: 'email' })
	@IsEmail()
	@IsString()
	email!: string;
}
