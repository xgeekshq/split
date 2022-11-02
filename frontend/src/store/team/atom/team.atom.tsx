import { atom } from 'recoil';

import { CreateTeamUser } from '../../../types/team/team.user';
import { UserList } from '../../../types/team/userList';

export const membersListState = atom<CreateTeamUser[] | undefined>({
	key: 'membersList',
	default: undefined
});

export const usersListState = atom<UserList[] | undefined>({
	key: 'usersList',
	default: undefined
});
