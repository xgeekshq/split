import * as leanVirtualsPlugin from 'mongoose-lean-virtuals';
import { ObjectId, SchemaTypes, Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ColumnDocument, ColumnSchema } from './column.schema';
import User from '../../users/schemas/user.schema';

export type BoardDocument = Board & Document;

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

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  submitedByUser!: ObjectId;

  @Prop({ nullable: false })
  maxVotes!: number;

  @Prop({ nullable: false, type: [ColumnSchema] })
  columns!: ColumnDocument[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Board' }] })
  dividedBoards!: Board[] | ObjectId[];

  // @Prop({
  //   type: SchemaTypes.ObjectId,
  //   ref: 'Team',
  //   nullable: true,
  //   default: null,
  // })
  // team!: Team | ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  createdBy!: User | ObjectId;

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
