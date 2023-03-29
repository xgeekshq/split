import { ApiProperty } from '@nestjs/swagger';

export default class AzureLoginDto {
	@ApiProperty()
	token!: string;
}
