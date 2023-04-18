import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSetRecoilState } from 'recoil';

import { createTeamRequest } from '@/api/teamService';
import { ErrorMessages, SuccessMessages } from '@/constants/toasts/teams-messages';
import { toastState } from '@/store/toast/atom/toast.atom';
import { ToastStateEnum } from '@/utils/enums/toast-types';

const useCreateTeam = () => {
  const setToastState = useSetRecoilState(toastState);

  return useMutation(createTeamRequest, {
    onSuccess: () => {
      setToastState({
        open: true,
        content: SuccessMessages.CREATE,
        type: ToastStateEnum.SUCCESS,
      });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      setToastState({
        open: true,
        content:
          error.response?.data.message === 'INVALID_NAME'
            ? ErrorMessages.INVALID_NAME
            : ErrorMessages.CREATE,
        type: ToastStateEnum.ERROR,
      });
    },
  });
};

const createToastObject = (content: string, type: ToastStateEnum) => {
  return { open: true, content, type };
};

export const createSuccessMessage = (message: string) => {
  return createToastObject(message, ToastStateEnum.SUCCESS);
};

export default useCreateTeam;
