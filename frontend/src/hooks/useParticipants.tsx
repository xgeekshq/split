import { ToastStateEnum } from '@/utils/enums/toast-types';
import {
  addAndRemoveBoardParticipantsRequest,
  getBoardParticipantsRequest,
} from '@/api/boardService';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import useBoardUtils from './useBoardUtils';

interface AutoFetchProps {
  autoFetchBoardParticipants: boolean;
}

const useParticipants = ({ autoFetchBoardParticipants = false }: AutoFetchProps) => {
  const { boardId, queryClient, setToastState } = useBoardUtils();

  const fetchBoardParticipants = useQuery(
    ['participants', { id: boardId }],
    () => getBoardParticipantsRequest(boardId),
    {
      enabled: autoFetchBoardParticipants,
      refetchOnWindowFocus: true,
      onError: () => {
        queryClient.invalidateQueries(['board', { id: boardId }]);
        setToastState({
          open: true,
          content: 'Error getting the board',
          type: ToastStateEnum.ERROR,
        });
      },
    },
  );

  const addAndRemoveBoardParticipants = useMutation(addAndRemoveBoardParticipantsRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries(['board', { id: boardId }]);
      setToastState({
        open: true,
        content: 'The board was successfully updated.',
        type: ToastStateEnum.SUCCESS,
      });
    },
    onError: (error: AxiosError) => {
      queryClient.invalidateQueries(['board', { id: boardId }]);
      const errorMessage = error.response?.data.message.includes('max votes')
        ? error.response?.data.message
        : 'Error updating the board';

      setToastState({
        open: true,
        content: errorMessage,
        type: ToastStateEnum.ERROR,
      });
    },
  });

  return {
    fetchBoardParticipants,
    addAndRemoveBoardParticipants,
  };
};

export default useParticipants;
