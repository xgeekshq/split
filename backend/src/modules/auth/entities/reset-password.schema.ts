import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type ResetPasswordDocument = ResetPassword & mongoose.Document;

@Schema()
export default class ResetPassword {
	@Prop({ nullable: false, unique: true })
	emailAddress!: string;

	@Prop({ nullable: true, unique: true })
	token?: string;

	@Prop({ default: Date.now })
	updatedAt!: Date;

	@Prop({ nullable: false })
	newPassword?: string;
}

export const ResetPasswordSchema = SchemaFactory.createForClass(ResetPassword);
