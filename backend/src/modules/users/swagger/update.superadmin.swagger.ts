import { ApiProperty } from '@nestjs/swagger';

export class UpdateSuperAdminSwagger {
	@ApiProperty()
	id!: string;

	@ApiProperty()
	isSAdmin!: boolean;
}
