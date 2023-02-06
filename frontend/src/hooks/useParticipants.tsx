import { ToastStateEnum } from '@/utils/enums/toast-types';
import { getBoardParticipantsRequest } from '@/api/boardService';
import { useQuery } from '@tanstack/react-query';
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

  return {
    fetchBoardParticipants,
  };
};

export default useParticipants;
