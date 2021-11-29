import { IsNotEmpty } from 'class-validator';
import UserDto from '../../users/dto/user.dto';

export default class CardDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  createdBy: UserDto;
}
