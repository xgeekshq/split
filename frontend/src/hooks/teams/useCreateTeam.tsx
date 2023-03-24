import { useMutation } from '@tanstack/react-query';

import { createTeamRequest } from '@/api/teamService';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { AxiosError } from 'axios';

import { ROUTES } from '@/utils/routes';
import { INVALID_NAME } from '@/errors/teams/errors';
import useTeamUtils from '../useTeamUtils';

const useCreateTeam = () => {
  const {
    setToastState,
    router: { push },
  } = useTeamUtils();

  return useMutation(createTeamRequest, {
    onSuccess: () => {
      setToastState({
        open: true,
        content: 'The team was successfully created.',
        type: ToastStateEnum.SUCCESS,
      });

      // CHECK: Should this Hook be responsible for changing the Page?
      push(ROUTES.Teams);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      setToastState({
        open: true,
        content:
          error.response?.data.message === 'INVALID_NAME'
            ? INVALID_NAME
            : 'Error creating the team',
        type: ToastStateEnum.ERROR,
      });
    },
  });
};

export default useCreateTeam;
