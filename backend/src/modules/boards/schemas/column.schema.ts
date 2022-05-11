import * as mongoose from 'mongoose';
import * as leanVirtualsPlugin from 'mongoose-lean-virtuals';
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

ColumnSchema.plugin(leanVirtualsPlugin);

// ColumnSchema.virtual('countCards').get(function (this: ColumnDocument) {
//   return this.cards.reduce((acc, card) => {
//     acc++;
//     if (card.items.length > 1) {
//       card.items.forEach(() => {
//         acc++;
//       });
//     }
//     return acc;
//   }, 0);
// });
