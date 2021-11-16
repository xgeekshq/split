import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

class CardDto {
  @IsString()
  _id: string = uuidv4();

  @IsNotEmpty()
  title: string;

  @IsEmail()
  @IsNotEmpty()
  createdBy: string;
}

export default CardDto;
