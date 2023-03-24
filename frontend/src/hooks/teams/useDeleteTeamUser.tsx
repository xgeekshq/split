import { useMutation /* , useQueryClient */ } from '@tanstack/react-query';

import { deleteTeamUser } from '@/api/teamService';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import useTeamUtils from '../useTeamUtils';

// import { TEAMS_KEY } from './';

// CHECK: When is this Function Called?
const useDeleteTeamUser = (/* teamId: string */) => {
  // const queryClient = useQueryClient();
  const { setToastState } = useTeamUtils();

  return useMutation(deleteTeamUser, {
    onSuccess: async (/* _data, userId */) => {
      // await Promise.all([
      //   //queryClient.invalidateQueries([TEAMS_KEY, teamId]),
      //   //queryClient.invalidateQueries([TEAMS_KEY, 'not', 'user', userId]),
      // ]);

      setToastState({
        open: true,
        content: 'The user was successfully removed from the team.',
        type: ToastStateEnum.SUCCESS,
      });
    },
    onError: () => {
      setToastState({
        open: true,
        content: 'Error removing user from the team.',
        type: ToastStateEnum.ERROR,
      });
    },
  });
};

export default useDeleteTeamUser;
