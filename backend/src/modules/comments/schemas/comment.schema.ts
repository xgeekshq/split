import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import BaseModel from 'src/libs/models/base.model';
import User from 'src/modules/users/entities/user.schema';

export type CommentDocument = Comment & mongoose.Document;

@Schema({
	timestamps: true
})
export default class Comment extends BaseModel {
	@Prop({ nullable: false })
	text!: string;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
	createdBy!: User | mongoose.Schema.Types.ObjectId;

	@Prop({ nullable: false })
	anonymous!: boolean;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
