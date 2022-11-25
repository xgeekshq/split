import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JWT_ACCESS_TOKEN_EXPIRATION_TIME, JWT_ACCESS_TOKEN_SECRET } from 'src/libs/constants/jwt';

export const JwtRegister = JwtModule.registerAsync({
	imports: [ConfigModule],
	inject: [ConfigService],
	useFactory: (configService: ConfigService) => ({
		secret: configService.get(JWT_ACCESS_TOKEN_SECRET),
		signOptions: {
			expiresIn: `${configService.get(JWT_ACCESS_TOKEN_EXPIRATION_TIME)}s`
		}
	})
});
