import { ApiProperty } from '@nestjs/swagger';

export class LoginResponse {
	@ApiProperty()
	id!: string;

	@ApiProperty({
		type: Object,
		properties: {
			expiresIn: {
				type: 'number',
				default: 3600
			},
			token: {
				type: 'string'
			}
		}
	})
	accessToken!: {
		expiresIn: number;
		token: string;
	};

	@ApiProperty({
		type: Object,
		properties: {
			expiresIn: {
				type: 'number',
				default: 3600
			},
			token: {
				type: 'string'
			}
		}
	})
	refreshToken!: {
		expiresIn: number;
		token: string;
	};

	@ApiProperty({ type: String, format: 'email' })
	email!: string;

	@ApiProperty()
	firstName!: string;

	@ApiProperty()
	lastName!: string;

	@ApiProperty({ default: 'local' })
	strategy!: string;

	@ApiProperty({ default: false })
	isSAdmin!: boolean;
}
