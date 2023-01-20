import { PartialType } from '@nestjs/mapped-types';
import ColumnDto from './column.dto';

export class UpdateColumnDto extends PartialType(ColumnDto) {}
