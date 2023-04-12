import faker from '@faker-js/faker';
import { buildTestFactory } from './generic-factory.mock';
import ResetPassword from 'src/modules/auth/entities/reset-password.schema';

const dateCreatedAt = faker.date.soon();

const mockResetPasswordData = () => {
	return {
		emailAddress: faker.internet.email(),
		token: faker.datatype.string(),
		updatedAt: dateCreatedAt,
		newPassword: faker.internet.password()
	};
};

export const ResetPasswordFactory = buildTestFactory<ResetPassword>(() => {
	return mockResetPasswordData();
});
