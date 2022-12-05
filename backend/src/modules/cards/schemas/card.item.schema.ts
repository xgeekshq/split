import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes } from 'mongoose';
import * as leanVirtualsPlugin from 'mongoose-lean-virtuals';
import User from 'src/modules/users/entities/user.schema';
import { CommentDocument, CommentSchema } from '../../comments/schemas/comment.schema';

export type CardItemDocument = CardItem & Document;

@Schema()
export default class CardItem {
	@Prop({ nullable: false })
	text!: string;

	@Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'User' }] })
	votes!: User[] | ObjectId[];

	@Prop({ type: [CommentSchema] })
	comments!: CommentDocument[];

	@Prop({ type: SchemaTypes.ObjectId, ref: 'User', nullable: false })
	createdBy!: User | ObjectId;

	@Prop()
	createdByTeam!: string;

	@Prop({ nullable: false, default: false })
	anonymous!: boolean;
}

export const CardItemSchema = SchemaFactory.createForClass(CardItem);

CardItemSchema.plugin(leanVirtualsPlugin);
