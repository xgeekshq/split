import { PartialType } from '@nestjs/mapped-types';
import BoardDto from './board.dto';

export class UpdateBoardDto extends PartialType(BoardDto) {}
