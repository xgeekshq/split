import { IsOptional } from 'class-validator';

class BoardPasswordDto {
  @IsOptional()
  password: string;
}

export default BoardPasswordDto;
