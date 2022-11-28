import { QueryClient, useQueryClient } from 'react-query';
import { NextRouter, useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { SetterOrUpdater, useRecoilValue, useSetRecoilState } from 'recoil';

import { toastState } from '@/store/toast/atom/toast.atom';
import { Team } from '@/types/team/team';
import { membersListState, teamsListState } from '../store/team/atom/team.atom';
import { TeamUser } from '../types/team/team.user';
import { ToastStateEnum } from '../utils/enums/toast-types';

type TeamUtilsType = {
  userId: string;
  teamId: string | string[] | undefined;
  queryClient: QueryClient;
  setToastState: SetterOrUpdater<{ open: boolean; type: ToastStateEnum; content: string }>;
  router: NextRouter;
  membersList: TeamUser[];
  setMembersList: SetterOrUpdater<TeamUser[]>;
  teamsList: Team[];
  setTeamsList: SetterOrUpdater<Team[]>;
};

const useTeamUtils = (): TeamUtilsType => {
  const router = useRouter();
  const { data: session } = useSession({ required: false });

  const queryClient = useQueryClient();

  let userId = '';

  if (session) userId = session.user.id;

  const setToastState = useSetRecoilState(toastState);
  const membersList = useRecoilValue(membersListState);
  const setMembersList = useSetRecoilState(membersListState);

  const { teamId } = router.query;

  const teamsList = useRecoilValue(teamsListState);
  const setTeamsList = useSetRecoilState(teamsListState);

  return {
    userId,
    teamId,
    queryClient,
    setToastState,
    router,
    membersList,
    setMembersList,
    teamsList,
    setTeamsList,
  };
};

export default useTeamUtils;
