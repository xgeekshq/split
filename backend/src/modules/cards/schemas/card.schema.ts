import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes } from 'mongoose';
import * as leanVirtualsPlugin from 'mongoose-lean-virtuals';
import BaseModel from 'src/libs/models/base.model';
import User from 'src/modules/users/entities/user.schema';
import Comment, { CommentSchema } from '../../comments/schemas/comment.schema';
import CardItem, { CardItemSchema } from './card.item.schema';

export type CardDocument = Card & Document;

@Schema({
	toJSON: {
		virtuals: true
	}
})
export default class Card extends BaseModel {
	@Prop({ nullable: false })
	text!: string;

	@Prop({ nullable: false, type: [CardItemSchema] })
	items!: CardItem[];

	@Prop({ type: [CommentSchema] })
	comments!: Comment[];

	@Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'User' }] })
	votes!: User[] | ObjectId[];

	@Prop({ type: SchemaTypes.ObjectId, ref: 'User', nullable: false })
	createdBy!: User | ObjectId;

	@Prop()
	createdByTeam!: string;

	@Prop({ nullable: false, default: false })
	anonymous!: boolean;
}

export const CardSchema = SchemaFactory.createForClass(Card);

CardSchema.plugin(leanVirtualsPlugin);
