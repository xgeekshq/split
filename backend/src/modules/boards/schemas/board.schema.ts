import * as leanVirtualsPlugin from 'mongoose-lean-virtuals';
import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ColumnDocument, ColumnSchema } from './column.schema';
import User from '../../users/schemas/user.schema';

export type BoardDocument = Board & mongoose.Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
})
export default class Board {
  @Prop({ nullable: false })
  title!: string;

  @Prop({ nullable: false })
  isPublic!: boolean;

  @Prop({ nullable: true })
  password?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  submitedByUser!: mongoose.Schema.Types.ObjectId;

  @Prop({ nullable: false })
  maxVotes!: number;

  @Prop({ nullable: false, type: [ColumnSchema] })
  columns!: ColumnDocument[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Board' }] })
  dividedBoards!: Board[] | mongoose.Schema.Types.ObjectId[];

  // @Prop({
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Team',
  //   nullable: true,
  //   default: null,
  // })
  // team!: Team | mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy!: User | mongoose.Schema.Types.ObjectId;

  @Prop({ default: false })
  recurrent!: boolean;

  @Prop({ default: false })
  isSubBoard!: boolean;
}

export const BoardSchema = SchemaFactory.createForClass(Board);

BoardSchema.plugin(leanVirtualsPlugin);

BoardSchema.virtual('users', {
  ref: 'BoardUser',
  localField: '_id',
  foreignField: 'board',
  justOne: false,
});
