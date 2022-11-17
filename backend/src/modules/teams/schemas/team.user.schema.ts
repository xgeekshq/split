import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes } from 'mongoose';
import * as leanVirtualsPlugin from 'mongoose-lean-virtuals';

import { TeamRoles } from 'libs/enum/team.roles';
import User from 'modules/users/schemas/user.schema';

import Team from './teams.schema';

export type TeamUserDocument = TeamUser & Document;

@Schema()
export default class TeamUser {
	@Prop({
		nullable: false,
		type: String,
		enum: [TeamRoles.ADMIN, TeamRoles.MEMBER, TeamRoles.STAKEHOLDER]
	})
	role!: string;

	@Prop({
		type: Boolean,
		nullable: false
	})
	isNewJoiner!: boolean;

	@Prop({ type: SchemaTypes.ObjectId, ref: 'User', nullable: false })
	user!: User | ObjectId;

	@Prop({ type: SchemaTypes.ObjectId, ref: 'Team', nullable: false })
	team!: Team | ObjectId;
}

export const TeamUserSchema = SchemaFactory.createForClass(TeamUser);

TeamUserSchema.plugin(leanVirtualsPlugin);

TeamUserSchema.virtual('teamData', {
	ref: 'Team',
	localField: 'team',
	foreignField: '_id',
	justOne: false
});
