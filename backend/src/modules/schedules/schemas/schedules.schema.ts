import * as leanVirtualsPlugin from 'mongoose-lean-virtuals';
import { ObjectId, SchemaTypes, Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type SchedulesDocument = Schedules & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
})
export default class Schedules {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Board', nullable: false })
  board!: ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Team', nullable: false })
  team!: ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', nullable: false })
  owner!: ObjectId;

  @Prop({ type: Number, default: false })
  maxUsers!: number;

  @Prop({ type: Boolean, default: false })
  recurrent!: boolean;

  @Prop({ type: String, nullable: true, default: null })
  maxVotes?: string;

  @Prop({ type: Boolean, nullable: false, default: false })
  hideCards?: boolean;

  @Prop({ type: Boolean, nullable: false, default: false })
  hideVotes?: boolean;

  @Prop({ type: Boolean, nullable: false, default: false })
  postAnonymously?: boolean;
}

export const SchedulesSchema = SchemaFactory.createForClass(Schedules);

SchedulesSchema.plugin(leanVirtualsPlugin);
