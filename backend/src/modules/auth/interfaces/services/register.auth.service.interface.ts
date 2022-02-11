import RegisterDto from '../../../users/dto/register.dto';
import { UserDocument } from '../../../users/schemas/user.schema';

export interface RegisterAuthService {
  register(registrationData: RegisterDto): Promise<UserDocument>;
}
