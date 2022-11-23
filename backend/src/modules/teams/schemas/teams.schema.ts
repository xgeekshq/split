import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as leanVirtualsPlugin from 'mongoose-lean-virtuals';

import Board from '../../boards/schemas/board.schema';

export type TeamDocument = Team & Document;

@Schema({
	timestamps: true,
	toJSON: { virtuals: true },
	toObject: { virtuals: true }
})
export default class Team {
	@Prop({ nullable: false })
	name!: string;

	boards?: Board[];
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
