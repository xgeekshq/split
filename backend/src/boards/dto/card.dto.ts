import { IsNotEmpty } from 'class-validator';
import { UserDto } from '../../users/dto/user.dto';

class CardDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  createdBy: UserDto;
}

export default CardDto;
