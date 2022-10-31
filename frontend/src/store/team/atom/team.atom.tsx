import { atom } from 'recoil';

import { CreateTeamUser } from '../../../types/team/team.user';

export const membersListState = atom<CreateTeamUser[] | undefined>({
	key: 'membersList',
	default: undefined
});
