import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { NextRouter, useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { SetterOrUpdater, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { toastState } from '@/store/toast/atom/toast.atom';
import { Team } from '@/types/team/team';
import { UserList } from '@/types/team/userList';
import { Session } from 'next-auth/core/types';
import { teamsListState, usersListState } from '../store/team/atom/team.atom';
import { ToastStateEnum } from '../utils/enums/toast-types';

type TeamUtilsType = {
  loggedUserId: string;
  teamId: string;
  queryClient: QueryClient;
  setToastState: SetterOrUpdater<{ open: boolean; type: ToastStateEnum; content: string }>;
  router: NextRouter;
  teamsList: Team[];
  setTeamsList: SetterOrUpdater<Team[]>;
  usersList: UserList[];
  userId: string | undefined;
  session: Session | null;
  isSAdmin: boolean;
};

const useTeamUtils = (): TeamUtilsType => {
  const router = useRouter();
  const { data: session } = useSession({ required: false });

  const queryClient = useQueryClient();

  const loggedUserId = session?.user.id || '';

  const { userId } = router.query;

  const setToastState = useSetRecoilState(toastState);

  const usersList = useRecoilValue(usersListState);

  const { teamId } = router.query;

  const [teamsList, setTeamsList] = useRecoilState(teamsListState);

  const isSAdmin = session?.user.isSAdmin ?? false;

  return {
    loggedUserId,
    teamId: String(teamId),
    queryClient,
    setToastState,
    router,
    teamsList,
    setTeamsList,
    usersList,
    userId: Array.isArray(userId) ? userId[0] : userId,
    session,
    isSAdmin,
  };
};

export default useTeamUtils;
