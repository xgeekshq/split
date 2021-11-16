import { Column, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

export abstract class Content {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  title: string;
}
