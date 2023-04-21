import { useMutation } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';

import { createErrorMessage } from '@/constants/toasts';
import { ErrorMessages } from '@/constants/toasts/board-messages';
import { newBoardState } from '@/store/board/atoms/board.atom';
import { toastState } from '@/store/toast/atom/toast.atom';
import { createBoardRequest } from '@api/boardService';

const useCreateBoard = () => {
  const setNewBoard = useSetRecoilState(newBoardState);
  const setToastState = useSetRecoilState(toastState);

  return useMutation(createBoardRequest, {
    onSuccess: (data) => {
      setNewBoard(data._id);
    },
    onError: () => {
      setToastState(createErrorMessage(ErrorMessages.CREATE));
    },
  });
};

export default useCreateBoard;
