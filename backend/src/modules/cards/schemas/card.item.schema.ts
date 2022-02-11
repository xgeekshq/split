import * as mongoose from 'mongoose';
import User from 'src/modules/users/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CardItemDocument = CardItem & mongoose.Document;

@Schema()
export default class CardItem {
  @Prop({ nullable: false })
  text!: string;

  //   @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  //   votes!: User[] | mongoose.Schema.Types.ObjectId[];

  //   @Prop({ type: [CommentSchema] })
  //   comments!: Comment[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', nullable: false })
  createdBy!: User | mongoose.Schema.Types.ObjectId;
}

export const CardItemSchema = SchemaFactory.createForClass(CardItem);
