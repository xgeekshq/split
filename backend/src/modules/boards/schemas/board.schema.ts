import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import User from '../../users/schemas/user.schema';
import Column, { ColumnSchema } from './column.schema';

export type BoardDocument = Board & mongoose.Document;

@Schema()
export default class Board {
  @Prop({ nullable: false })
  title!: string;

  @Prop({ nullable: false })
  isPublic!: boolean;

  @Prop({ nullable: true })
  password?: string;

  @Prop({ type: Date, default: Date.now })
  creationDate!: Date;

  @Prop({ nullable: false })
  maxVotes!: number;

  @Prop({ nullable: false, type: [ColumnSchema] })
  columns!: Column[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', nullable: false })
  createdBy!: User | mongoose.Schema.Types.ObjectId;
}

export const BoardSchema = SchemaFactory.createForClass(Board);
