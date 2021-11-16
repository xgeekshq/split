import { IsNotEmpty, ValidateIf } from 'class-validator';

class UpdateLockedDto {
  @IsNotEmpty()
  locked: boolean;

  @ValidateIf((o) => o.locked === true)
  @IsNotEmpty()
  password: string;
}

export default UpdateLockedDto;
