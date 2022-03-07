import { IsNotEmpty, IsString } from 'class-validator';

export default class CreateUserAzureDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  email!: string;
}
