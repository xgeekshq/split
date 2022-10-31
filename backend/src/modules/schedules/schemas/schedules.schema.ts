import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes } from 'mongoose';
import * as leanVirtualsPlugin from 'mongoose-lean-virtuals';

export type SchedulesDocument = Schedules & Document;

@Schema({
	timestamps: true,
	toJSON: {
		virtuals: true
	}
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

	@Prop({ type: String, nullable: false, default: false })
	willRunAt!: string;
}

export const SchedulesSchema = SchemaFactory.createForClass(Schedules);

SchedulesSchema.plugin(leanVirtualsPlugin);
