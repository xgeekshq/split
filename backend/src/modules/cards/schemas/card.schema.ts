import * as leanVirtualsPlugin from 'mongoose-lean-virtuals';
import { ObjectId, SchemaTypes, Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  CommentDocument,
  CommentSchema,
} from '../../comments/schemas/comment.schema';
import User from '../../users/schemas/user.schema';
import { CardItemDocument, CardItemSchema } from './card.item.schema';

export type CardDocument = Card & Document;

@Schema({
  toJSON: {
    virtuals: true,
  },
})
export default class Card {
  @Prop({ nullable: false })
  text!: string;

  @Prop({ nullable: false, type: [CardItemSchema] })
  items!: CardItemDocument[];

  @Prop({ type: [CommentSchema] })
  comments!: CommentDocument[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'User' }] })
  votes!: User[] | ObjectId[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', nullable: false })
  createdBy!: User | ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Team', nullable: true })
  createdByTeam!: ObjectId;
}

export const CardSchema = SchemaFactory.createForClass(Card);

CardSchema.plugin(leanVirtualsPlugin);
