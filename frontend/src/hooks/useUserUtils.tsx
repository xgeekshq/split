import { QueryClient, useQueryClient } from 'react-query';
import { NextRouter, useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { SetterOrUpdater, useRecoilState, useSetRecoilState } from 'recoil';

import { toastState } from '@/store/toast/atom/toast.atom';
import { UserWithTeams } from '@/types/user/user';
import { usersWithTeamsState } from '../store/user/atoms/user.atom';
import { ToastStateEnum } from '../utils/enums/toast-types';

type UserUtilsType = {
  userId: string;
  queryClient: QueryClient;
  setToastState: SetterOrUpdater<{ open: boolean; type: ToastStateEnum; content: string }>;
  router: NextRouter;
  usersWithTeamsList: UserWithTeams[];
  setUsersWithTeamsList: SetterOrUpdater<UserWithTeams[]>;
};

const useUserUtils = (): UserUtilsType => {
  const router = useRouter();
  const { data: session } = useSession({ required: false });

  const queryClient = useQueryClient();

  let userId = '';

  if (session) userId = session.user.id;

  const setToastState = useSetRecoilState(toastState);
  const [usersWithTeamsList, setUsersWithTeamsList] = useRecoilState(usersWithTeamsState);

  return {
    userId,
    queryClient,
    setToastState,
    router,
    usersWithTeamsList,
    setUsersWithTeamsList,
  };
};

export default useUserUtils;
