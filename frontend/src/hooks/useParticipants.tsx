import { ToastStateEnum } from '@/utils/enums/toast-types';
import {
  addAndRemoveBoardParticipantsRequest,
  getBoardParticipantsRequest,
} from '@/api/boardService';
import { useMutation, useQuery } from '@tanstack/react-query';
import { BoardUser } from '@/types/board/board.user';
import useBoardUtils from './useBoardUtils';

interface AutoFetchProps {
  autoFetchBoardParticipants: boolean;
}

const useParticipants = ({ autoFetchBoardParticipants = false }: AutoFetchProps) => {
  const { boardId, queryClient, setToastState, usersList } = useBoardUtils();

  const fetchBoardParticipants = useQuery(
    ['participants', { id: boardId }],
    () => getBoardParticipantsRequest(boardId),
    {
      enabled: autoFetchBoardParticipants,
      refetchOnWindowFocus: true,
      onError: () => {
        queryClient.invalidateQueries(['participants', { id: boardId }]);
        setToastState({
          open: true,
          content: 'Error getting the board',
          type: ToastStateEnum.ERROR,
        });
      },
    },
  );

  const addAndRemoveBoardParticipants = useMutation(addAndRemoveBoardParticipantsRequest, {
    onMutate: async (addedAndRemovedMembers) => {
      await queryClient.cancelQueries(['participants', { id: boardId }]);

      const previousBoardParticipants = queryClient.getQueryData<BoardUser[]>([
        'participants',
        { id: boardId },
      ]);

      queryClient.setQueryData<BoardUser[]>(
        ['participants', { id: boardId }],
        (oldBoardUsers: BoardUser[] | undefined) => {
          if (!oldBoardUsers) return oldBoardUsers;
          const removedBoardUserIds = addedAndRemovedMembers.removeBoardUsers;
          const createdBoardUsers: BoardUser[] = addedAndRemovedMembers.addBoardUsers.map(
            (boardUser) => ({
              ...boardUser,
              user: usersList.filter((user) => user._id === boardUser.user._id)[0],
            }),
          );
          const usersFromParticipantsList = oldBoardUsers.filter(
            (participant) => !removedBoardUserIds.includes(participant._id as string),
          );

          const finalParticipantsList: BoardUser[] = [
            ...usersFromParticipantsList,
            ...createdBoardUsers,
          ];

          setToastState({
            open: true,
            content: 'Board participants successfully updated.',
            type: ToastStateEnum.SUCCESS,
          });

          return finalParticipantsList;
        },
      );

      return { previousBoardParticipants };
    },
    onSettled: () => {
      queryClient.invalidateQueries(['board', { id: boardId }]);
      queryClient.invalidateQueries(['participants', { id: boardId }]);
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(
        ['participants', { id: boardId }],
        context?.previousBoardParticipants,
      );
      setToastState({
        open: true,
        content: 'Error while updating board participants.',
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
