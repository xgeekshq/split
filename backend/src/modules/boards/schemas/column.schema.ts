import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CardDocument, CardSchema } from '../../cards/schemas/card.schema';

export type ColumnDocument = Column & mongoose.Document;

@Schema()
export default class Column {
  @Prop({ nullable: false })
  title!: string;

  @Prop({ nullable: false })
  color!: string;

  @Prop({ nullable: false, type: [CardSchema] })
  cards!: CardDocument[];
}

export const ColumnSchema = SchemaFactory.createForClass(Column);
