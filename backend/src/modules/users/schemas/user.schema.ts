import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & mongoose.Document;

@Schema()
export default class User {
  @Prop({ nullable: false })
  name!: string;

  @Prop({ nullable: false })
  password!: string;

  @Prop({ nullable: false, unique: true })
  email!: string;

  @Prop({ type: Date }) createdOn?: Date;

  @Prop({ type: Date }) updatedOn?: Date;

  @Prop({ nullable: false }) strategy!: string;

  @Prop({ nullable: true })
  currentHashedRefreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
