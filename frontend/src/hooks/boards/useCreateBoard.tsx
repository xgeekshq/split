import { useMutation } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';

import { createErrorMessage, createSuccessMessage } from '@/constants/toasts';
import { ErrorMessages, SuccessMessages } from '@/constants/toasts/board-messages';
import { newBoardState } from '@/store/board/atoms/board.atom';
import { toastState } from '@/store/toast/atom/toast.atom';
import { createBoardRequest } from '@api/boardService';

const useCreateBoard = () => {
  const setNewBoard = useSetRecoilState(newBoardState);
  const setToastState = useSetRecoilState(toastState);

  return useMutation(createBoardRequest, {
    onSuccess: (data) => {
      setNewBoard(data._id);
      setToastState(createSuccessMessage(SuccessMessages.CREATE));
    },
    onError: () => {
      setToastState(createErrorMessage(ErrorMessages.CREATE));
    },
  });
};

export default useCreateBoard;
