export default class UserModel {
	_id?: string;

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
