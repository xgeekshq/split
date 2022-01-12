import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import Card, { CardSchema } from './card.schema';

export type ColumnDocument = Column & mongoose.Document;

@Schema()
export default class Column {
  @Prop({ nullable: false })
  title!: string;

  @Prop({ nullable: false })
  color!: string;

  @Prop({ nullable: false, type: [CardSchema] })
  cards!: Card[];
}

export const ColumnSchema = SchemaFactory.createForClass(Column);
