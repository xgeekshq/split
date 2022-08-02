import { ApiProperty } from '@nestjs/swagger';

export class SocketIdDto {
	@ApiProperty()
	socketId!: string;
}
