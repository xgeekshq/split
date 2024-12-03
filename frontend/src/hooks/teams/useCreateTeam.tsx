import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useSetRecoilState } from 'recoil';

import { createTeamRequest } from '@/api/teamService';
import { createErrorMessage, createSuccessMessage } from '@/constants/toasts';
import { ErrorMessages, SuccessMessages } from '@/constants/toasts/teams-messages';
import { toastState } from '@/store/toast/atom/toast.atom';

const useCreateTeam = () => {
  const setToastState = useSetRecoilState(toastState);

  return useMutation({
    mutationFn: createTeamRequest,
    onSuccess: () => {
      setToastState(createSuccessMessage(SuccessMessages.CREATE));
    },
    onError: (error: AxiosError<{ message: string }>) => {
      setToastState(
        createErrorMessage(
          error.response?.data.message === 'INVALID_NAME'
            ? ErrorMessages.INVALID_NAME
            : ErrorMessages.CREATE,
        ),
      );
    },
  });
};

export default useCreateTeam;
