export default class UserModel {
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
