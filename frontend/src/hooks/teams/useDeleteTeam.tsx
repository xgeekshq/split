import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteTeam } from '@/api/teamService';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import useTeamUtils from '../useTeamUtils';

import { TEAMS_KEY } from '../useTeam';

const useDeleteTeam = () => {
  const queryClient = useQueryClient();
  const { setToastState } = useTeamUtils();

  return useMutation(deleteTeam, {
    onSuccess: () => {
      queryClient.invalidateQueries([TEAMS_KEY]);

      setToastState({
        open: true,
        content: 'The team was successfully deleted.',
        type: ToastStateEnum.SUCCESS,
      });
    },
    onError: () => {
      setToastState({
        open: true,
        content: 'Error deleting the team.',
        type: ToastStateEnum.ERROR,
      });
    },
  });
};

export default useDeleteTeam;
