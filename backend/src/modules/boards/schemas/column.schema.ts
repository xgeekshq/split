import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as leanVirtualsPlugin from 'mongoose-lean-virtuals';
import Card, { CardSchema } from 'src/modules/cards/schemas/card.schema';

export type ColumnDocument = Column & mongoose.Document;

@Schema()
export default class Column {
	_id: string;

	@Prop({ nullable: false })
	title!: string;

	@Prop({ nullable: false })
	color!: string;

	@Prop({ nullable: false, type: [CardSchema] })
	cards!: Card[];
}

export const ColumnSchema = SchemaFactory.createForClass(Column);

ColumnSchema.plugin(leanVirtualsPlugin);
