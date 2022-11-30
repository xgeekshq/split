export default class User {
	id?: string;

	firstName: string;

	lastName: string;

	password: string;

	email: string;

	strategy: string;

	currentHashedRefreshToken?: string;

	isSAdmin: boolean;

	isDeleted: boolean;

	joinedAt: Date;
}
