import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  CommentDocument,
  CommentSchema,
} from '../../comments/schemas/comment.schema';
import User from '../../users/schemas/user.schema';
import { CardItemDocument, CardItemSchema } from './card.item.schema';

export type CardDocument = Card & mongoose.Document;

@Schema()
export default class Card {
  @Prop({ nullable: false })
  text!: string;

  @Prop({ nullable: false, type: [CardItemSchema] })
  items!: CardItemDocument[];

  @Prop({ type: [CommentSchema] })
  comments!: CommentDocument[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  votes!: User[] | mongoose.Schema.Types.ObjectId[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', nullable: false })
  createdBy!: User | mongoose.Schema.Types.ObjectId;
}

export const CardSchema = SchemaFactory.createForClass(Card);
