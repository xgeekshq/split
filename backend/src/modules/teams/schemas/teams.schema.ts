import { Document } from 'mongoose';
import * as leanVirtualsPlugin from 'mongoose-lean-virtuals';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TeamDocument = Team & Document;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export default class Team {
  @Prop({ nullable: false })
  name!: string;
}

export const TeamSchema = SchemaFactory.createForClass(Team);

// TeamSchema.plugin(leanVirtualsPlugin);

TeamSchema.virtual('users', {
  ref: 'TeamUser',
  localField: '_id',
  foreignField: 'team',
  justOne: false,
});
