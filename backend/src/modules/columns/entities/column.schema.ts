import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { mongooseLeanVirtuals } from 'mongoose-lean-virtuals';
import Card, { CardSchema } from 'src/modules/cards/entities/card.schema';

export type ColumnDocument = Column & mongoose.Document;

@Schema()
export default class Column {
	_id?: string;

	@Prop({ nullable: false })
	title!: string;

	@Prop({ nullable: false })
	color!: string;

	@Prop({ nullable: true, type: [CardSchema] })
	cards?: Card[];

	@Prop({ nullable: false, default: 'Write your comment here...' })
	cardText!: string;

	@Prop({ nullable: false, default: true })
	isDefaultText!: boolean;
}

export const ColumnSchema = SchemaFactory.createForClass(Column);

ColumnSchema.plugin(mongooseLeanVirtuals);
