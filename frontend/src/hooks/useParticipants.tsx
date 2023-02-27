import { ToastStateEnum } from '@/utils/enums/toast-types';
import { addAndRemoveBoardParticipantsRequest } from '@/api/boardService';
import { useMutation } from '@tanstack/react-query';
import { BoardUser } from '@/types/board/board.user';
import { GetBoardResponse } from '@/types/board/board';
import useBoardUtils from './useBoardUtils';

const useParticipants = () => {
  const { boardId, queryClient, setToastState, usersList } = useBoardUtils();

  const addAndRemoveBoardParticipants = useMutation(addAndRemoveBoardParticipantsRequest, {
    onMutate: async (updateBoardParticipants) => {
      await queryClient.cancelQueries(['board', { id: boardId }]);

      const previousBoard = queryClient.getQueryData<GetBoardResponse>(['board', { id: boardId }]);

      queryClient.setQueryData<GetBoardResponse>(
        ['board', { id: boardId }],
        (oldBoard: GetBoardResponse | undefined) => {
          const { addBoardUsers, removeBoardUsers, boardUserToUpdateRole } =
            updateBoardParticipants;

          if (!oldBoard) return oldBoard;
          const removedBoardUserIds = removeBoardUsers;

          const usersFromParticipantsList = oldBoard.board.users.filter(
            (participant) => !removedBoardUserIds.includes(participant._id as string),
          );

          if (boardUserToUpdateRole) {
            const participantToUpdateIdx = usersFromParticipantsList.findIndex(
              (participant) => participant._id === boardUserToUpdateRole._id,
            );
            usersFromParticipantsList.splice(participantToUpdateIdx, 1, boardUserToUpdateRole);
          }

          const finalParticipantsList: BoardUser[] = [
            ...usersFromParticipantsList,
            ...addBoardUsers,
          ];

          setToastState({
            open: true,
            content: 'Board participants successfully updated.',
            type: ToastStateEnum.SUCCESS,
          });

          return {
            mainBoard: oldBoard.mainBoard,
            board: {
              ...oldBoard.board,
              users: finalParticipantsList,
            },
          };
        },
      );

      return { previousBoard };
    },
    onSettled: (data, error, variables) => {
      queryClient.setQueryData<GetBoardResponse>(
        ['board', { id: boardId }],
        (oldBoard: GetBoardResponse | undefined) => {
          if (!data) return undefined;
          // Endpoint returns array if there were Board users created.
          // Otherwise it returns a Board User with the updated role.
          if (!oldBoard || !Array.isArray(data)) return oldBoard;

          const boardUsersWithoutId = variables.addBoardUsers.map(
            (addedBoardUser) => addedBoardUser.user._id,
          );

          const boardUsersWithId: BoardUser[] = oldBoard.board.users.filter(
            (boardUser) => !boardUsersWithoutId.includes(boardUser.user._id),
          );

          data.forEach((newBoardUser) => {
            const userFound = usersList.find((user) => user._id === newBoardUser.user);
            if (!userFound) return;
            const newBoardUserWithUser = {
              ...newBoardUser,
              user: userFound,
            };
            boardUsersWithId.push(newBoardUserWithUser);
          });

          return {
            mainBoard: oldBoard.mainBoard,
            board: {
              ...oldBoard.board,
              users: boardUsersWithId,
            },
          };
        },
      );
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(['board', { id: boardId }], context?.previousBoard);
      setToastState({
        open: true,
        content: 'Error while updating board participants.',
        type: ToastStateEnum.ERROR,
      });
    },
  });

  return {
    addAndRemoveBoardParticipants,
  };
};

export default useParticipants;
