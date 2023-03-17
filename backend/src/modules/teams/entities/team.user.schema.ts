import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes } from 'mongoose';
import * as leanVirtualsPlugin from 'mongoose-lean-virtuals';
import { TeamRoles } from 'src/libs/enum/team.roles';
import BaseModel from 'src/libs/models/base.model';
import User from 'src/modules/users/entities/user.schema';
import Team from './teams.schema';

export type TeamUserDocument = TeamUser & Document;

@Schema()
export default class TeamUser extends BaseModel {
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
	isNewJoiner?: boolean;

	@Prop({
		type: Boolean,
		nullable: false
	})
	canBeResponsible?: boolean;

	@Prop({ type: SchemaTypes.ObjectId, ref: 'User', nullable: false })
	user!: User | ObjectId | string;

	@Prop({ type: SchemaTypes.ObjectId, ref: 'Team', nullable: false })
	team?: Team | ObjectId | string;

	userCreated?: Date;
}

export const TeamUserSchema = SchemaFactory.createForClass(TeamUser);

TeamUserSchema.plugin(leanVirtualsPlugin);

TeamUserSchema.virtual('teamData', {
	ref: 'Team',
	localField: 'team',
	foreignField: '_id',
	justOne: false
});
