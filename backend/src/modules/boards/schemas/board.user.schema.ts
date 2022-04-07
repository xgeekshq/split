import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BoardRoles } from '../../../libs/enum/board.roles';
import User from '../../users/schemas/user.schema';

export type BoardUserDocument = BoardUser & mongoose.Document;

@Schema({
  toJSON: {
    virtuals: true,
  },
})
export default class BoardUser {
  @Prop({
    nullable: false,
    type: String,
    enum: [BoardRoles.RESPONSIBLE, BoardRoles.MEMBER, BoardRoles.OWNER],
  })
  role!: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', nullable: false })
  user!: User | mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Board', nullable: false })
  board!: mongoose.Schema.Types.ObjectId;

  @Prop({ nullable: false })
  votesCount!: number;
}

export const BoardUserSchema = SchemaFactory.createForClass(BoardUser);
