import { IsMongoId } from 'class-validator';

export class BaseParam {
  @IsMongoId()
  boardId!: string;
}
