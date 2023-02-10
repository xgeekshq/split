import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, SchemaTypes } from 'mongoose';
import { BoardRoles } from 'src/libs/enum/board.roles';
import User from 'src/modules/users/entities/user.schema';

export type BoardUserDocument = BoardUser & Document;

@Schema({
	toJSON: {
		virtuals: true
	}
})
export default class BoardUser {
	@Prop({
		nullable: false,
		type: String,
		enum: [BoardRoles.RESPONSIBLE, BoardRoles.MEMBER]
	})
	role!: string;

	@Prop({ type: SchemaTypes.ObjectId, ref: 'User', nullable: false })
	user!: User | ObjectId;

	@Prop({ type: SchemaTypes.ObjectId, ref: 'Board', nullable: false })
	board!: ObjectId;

	@Prop({ nullable: false })
	votesCount!: number;
}

export const BoardUserSchema = SchemaFactory.createForClass(BoardUser);
