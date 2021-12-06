import { IsNotEmpty, ValidateIf } from 'class-validator';

export default class UpdateLockedDto {
  @IsNotEmpty()
  locked!: boolean;

  @ValidateIf((o) => o.locked === true)
  @IsNotEmpty()
  password!: string;
}
