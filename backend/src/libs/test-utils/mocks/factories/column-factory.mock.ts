import faker from '@faker-js/faker';
import Column from 'src/modules/columns/entities/column.schema';
import { CardFactory } from './card-factory.mock';

const cardText = faker.lorem.words();

const mockColumnData = (params: Partial<Column>, cardsCount = 1): Column => {
	return {
		_id: faker.datatype.uuid(),
		title: faker.lorem.words(),
		color: '#aaaaaa',
		cards: CardFactory.createMany(cardsCount),
		cardText: cardText,
		isDefaultText: faker.datatype.boolean(),
		...params
	};
};

export const ColumnFactory = {
	create: (params: Partial<Column> = {}, cardsCount = 1): Column =>
		mockColumnData(params, cardsCount),
	createMany: (amount: number, cardsCount = 1, params: Partial<Column> = {}): Column[] =>
		Array.from({ length: amount }).map(() => ColumnFactory.create(params, cardsCount))
};
