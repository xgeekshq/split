import { ToastStateEnum } from '@/utils/enums/toast-types';
import { addAndRemoveBoardParticipantsRequest } from '@/api/boardService';
import { useMutation } from '@tanstack/react-query';
import { BoardUser } from '@/types/board/board.user';
import { GetBoardResponse } from '@/types/board/board';
import useBoardUtils from './useBoardUtils';

const useParticipants = () => {
  const { boardId, queryClient, setToastState, usersList } = useBoardUtils();

  const addAndRemoveBoardParticipants = useMutation(addAndRemoveBoardParticipantsRequest, {
    onMutate: async (addedAndRemovedMembers) => {
      await queryClient.cancelQueries(['board', { id: boardId }]);

      const previousBoard = queryClient.getQueryData<GetBoardResponse>(['board', { id: boardId }]);

      queryClient.setQueryData<GetBoardResponse>(
        ['board', { id: boardId }],
        (oldBoard: GetBoardResponse | undefined) => {
          if (!oldBoard) return oldBoard;
          const removedBoardUserIds = addedAndRemovedMembers.removeBoardUsers;
          const createdBoardUsers: BoardUser[] = addedAndRemovedMembers.addBoardUsers.map(
            (boardUser) => ({
              ...boardUser,
              user: usersList.filter((user) => user._id === boardUser.user._id)[0],
            }),
          );
          const usersFromParticipantsList = oldBoard.board.users.filter(
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

          return {
            mainBoardData: oldBoard.mainBoardData,
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
          if (!oldBoard) return oldBoard;
          if (!data) return undefined;

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
            mainBoardData: oldBoard.mainBoardData,
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
