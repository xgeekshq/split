import * as mongoose from 'mongoose';
import User from 'src/modules/users/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import CardItem, { CardItemSchema } from './card.item.schema';

export type CardDocument = Card & mongoose.Document;

@Schema()
export default class Card {
  @Prop({ nullable: false })
  text!: string;

  @Prop({ nullable: false, type: [CardItemSchema] })
  items!: CardItem[];

  // @Prop({ type: [CommentSchema] })
  // comments!: Comment[];

  // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  // votes!: User[] | mongoose.Schema.Types.ObjectId[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', nullable: false })
  createdBy!: User | mongoose.Schema.Types.ObjectId;
}

export const CardSchema = SchemaFactory.createForClass(Card);
