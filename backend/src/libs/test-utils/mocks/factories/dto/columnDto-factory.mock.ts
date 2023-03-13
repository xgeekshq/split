import faker from '@faker-js/faker';
import ColumnDto from 'src/modules/columns/dto/column.dto';
import { buildTestFactory } from '../generic-factory.mock';
import { cardDtoFactory } from './cardDto-factory.mock';

const mockColumnDto = () => {
	return {
		_id: faker.database.mongodbObjectId(),
		title: faker.lorem.words(),
		color: faker.helpers.arrayElement([
			'#CDFAE0',
			'#DEB7FF',
			'#9BFDFA',
			'#FE9EBF',
			'#9DCAFF',
			'#FEB9A9'
		]),
		cards: [cardDtoFactory.create()],
		cardText: faker.lorem.words(),
		isDefaultText: faker.datatype.boolean()
	};
};

export const columnDtoFactory = buildTestFactory<ColumnDto>(() => {
	return mockColumnDto();
});
