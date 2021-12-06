import { Column } from 'typeorm';

export default class ColumnEntity {
  @Column({ unique: true })
  _id?: string;

  @Column({ nullable: false })
  title!: string;

  @Column({ nullable: false })
  color!: string;

  @Column({ array: true, nullable: false })
  cardsOrder!: string[];
}
