import { IsEmail, IsString } from 'class-validator';

export class EmailParam {
  @IsEmail()
  @IsString()
  email!: string;
}
