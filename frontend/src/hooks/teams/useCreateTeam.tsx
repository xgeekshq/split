import { useMutation } from '@tanstack/react-query';

import { createTeamRequest } from '@/api/teamService';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { AxiosError } from 'axios';

import { useSetRecoilState } from 'recoil';
import { toastState } from '@/store/toast/atom/toast.atom';

import { INVALID_NAME } from '@/errors/teams/errors';

const useCreateTeam = () => {
  const setToastState = useSetRecoilState(toastState);

  return useMutation(createTeamRequest, {
    onSuccess: () => {
      setToastState({
        open: true,
        content: 'The team was successfully created.',
        type: ToastStateEnum.SUCCESS,
      });
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
