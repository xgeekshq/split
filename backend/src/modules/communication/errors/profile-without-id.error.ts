export class ProfileWithoutIdError extends Error {
	constructor() {
		super('Profile without id.');
	}
}
