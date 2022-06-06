import { atom } from 'recoil';

export const userState = atom({
	key: 'user',
	default: {
		firstName: '',
		lastName: '',
		email: '',
		id: '',
		strategy: ''
	}
});
