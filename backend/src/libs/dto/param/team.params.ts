import { IsMongoId, IsString } from 'class-validator';

export class TeamParams {
  @IsMongoId()
  @IsString()
  teamId!: string;
}
