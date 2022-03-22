import { IsNotEmpty, IsString } from 'class-validator';

export default class CreateUserAzureDto {
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @IsNotEmpty()
  @IsString()
  email!: string;
}
