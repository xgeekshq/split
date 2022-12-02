import { QueryClient, useQueryClient } from 'react-query';
import { NextRouter, useRouter } from 'next/router';
import { SetterOrUpdater, useRecoilState, useSetRecoilState } from 'recoil';

import { toastState } from '@/store/toast/atom/toast.atom';
import { UserWithTeams } from '@/types/user/user';
import { usersWithTeamsState } from '../store/user/atoms/user.atom';
import { ToastStateEnum } from '../utils/enums/toast-types';

type UserUtilsType = {
  queryClient: QueryClient;
  setToastState: SetterOrUpdater<{ open: boolean; type: ToastStateEnum; content: string }>;
  router: NextRouter;
  usersWithTeamsList: UserWithTeams[];
  setUsersWithTeamsList: SetterOrUpdater<UserWithTeams[]>;
};

const useUserUtils = (): UserUtilsType => {
  const router = useRouter();

  const queryClient = useQueryClient();

  const setToastState = useSetRecoilState(toastState);
  const [usersWithTeamsList, setUsersWithTeamsList] = useRecoilState(usersWithTeamsState);

  return {
    queryClient,
    setToastState,
    router,
    usersWithTeamsList,
    setUsersWithTeamsList,
  };
};

export default useUserUtils;
