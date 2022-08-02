export class ProfileWithoutEmailError extends Error {
	constructor() {
		super('Profile without email.');
	}
}
