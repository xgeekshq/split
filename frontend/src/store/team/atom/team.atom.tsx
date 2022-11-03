import { atom } from 'recoil';

import { TeamUser } from '../../../types/team/team.user';
import { UserList } from '../../../types/team/userList';

export const membersListState = atom<TeamUser[]>({
	key: 'membersList',
	default: []
});

export const usersListState = atom<UserList[] | undefined>({
	key: 'usersList',
	default: undefined
});
