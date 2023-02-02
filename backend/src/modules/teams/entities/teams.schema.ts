import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as leanVirtualsPlugin from 'mongoose-lean-virtuals';
import BaseModel from 'src/libs/models/base.model';
import Board from '../../boards/schemas/board.schema';
import TeamUser from './team.user.schema';

export type TeamDocument = Team & Document;

@Schema({
	timestamps: true,
	toJSON: { virtuals: true },
	toObject: { virtuals: true }
})
export default class Team extends BaseModel {
	@Prop({ nullable: false, required: true, unique: true })
	name!: string;

	boards?: Board[];

	users?: TeamUser[];
}

export const TeamSchema = SchemaFactory.createForClass(Team);

TeamSchema.plugin(leanVirtualsPlugin);

TeamSchema.virtual('users', {
	ref: 'TeamUser',
	localField: '_id',
	foreignField: 'team',
	justOne: false
});

TeamSchema.virtual('boards', {
	ref: 'Board',
	localField: '_id',
	foreignField: 'team',
	justOne: false
});
