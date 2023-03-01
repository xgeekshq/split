import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes } from 'mongoose';
import * as leanVirtualsPlugin from 'mongoose-lean-virtuals';
import { BoardPhases } from 'src/libs/enum/board.phases';
import BaseModel from 'src/libs/models/base.model';
import Team from 'src/modules/teams/entities/teams.schema';
import User from 'src/modules/users/entities/user.schema';
import Column, { ColumnSchema } from '../../columns/entities/column.schema';

export type BoardDocument = Board & Document;

@Schema({
	timestamps: true,
	toJSON: {
		virtuals: true
	}
})
export default class Board extends BaseModel {
	@Prop({ nullable: false })
	title!: string;

	@Prop({ nullable: false })
	isPublic!: boolean;

	@Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
	submitedByUser!: ObjectId;

	@Prop({ type: Date, nullable: true, default: null })
	submitedAt!: Date;

	@Prop({ nullable: false, type: [ColumnSchema] })
	columns!: Column[];

	@Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Board' }] })
	dividedBoards!: Board[] | ObjectId[];

	@Prop({
		type: SchemaTypes.ObjectId,
		ref: 'Team',
		nullable: true,
		default: null
	})
	team!: Team | ObjectId;

	@Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
	createdBy!: User | ObjectId;

	@Prop({ type: Boolean, default: false })
	recurrent!: boolean;

	@Prop({ type: Boolean, default: false })
	isSubBoard!: boolean;

	@Prop({ type: Number, default: 0 })
	boardNumber!: number;

	@Prop({ type: Number, nullable: true, default: null })
	maxVotes?: number;

	@Prop({ type: Boolean, nullable: false, default: false })
	hideCards?: boolean;

	@Prop({ type: Boolean, nullable: false, default: false })
	hideVotes?: boolean;

	@Prop({ type: Boolean, nullable: false, default: false })
	slackEnable!: boolean;

	@Prop({ type: String, nullable: true, default: null })
	slackChannelId?: string;

	@Prop({ type: Boolean, nullable: true, default: true })
	addCards: boolean;

	@Prop({ type: Boolean, nullable: true, default: false })
	postAnonymously: boolean;

	@Prop({
		type: String,
		nullable: true,
		enum: [BoardPhases.ADDCARDS, BoardPhases.VOTINGPHASE, BoardPhases.SUBMITED]
	})
	phase?: string;

	@Prop({ type: String })
	createdAt: string;
}

export const BoardSchema = SchemaFactory.createForClass(Board);

BoardSchema.plugin(leanVirtualsPlugin);

BoardSchema.virtual('users', {
	ref: 'BoardUser',
	localField: '_id',
	foreignField: 'board',
	justOne: false
});
