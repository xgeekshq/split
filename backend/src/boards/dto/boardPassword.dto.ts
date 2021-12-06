import { IsOptional } from 'class-validator';

export default class BoardPasswordDto {
  @IsOptional()
  password?: string;
}
