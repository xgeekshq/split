import { useMutation } from 'react-query';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';

import {
  handleAddComments,
  handleDeleteComments,
  handleUpdateComments,
} from '@/helper/board/transformBoard';
import BoardType from '@/types/board/board';
import ColumnType from '@/types/column';
import AddCommentDto from '@/types/comment/addComment.dto';
import { addCommentRequest, deleteCommentRequest, updateCommentRequest } from '../api/boardService';
import { ToastStateEnum } from '../utils/enums/toast-types';
import useBoardUtils from './useBoardUtils';

const useComments = () => {
  const { queryClient, setToastState } = useBoardUtils();
  const { data: session } = useSession({ required: false });

  const user = session?.user;

  const getBoardQuery = (id: string | undefined) => ['board', { id }];

  const getPrevData = async (id: string | undefined): Promise<BoardType | undefined> => {
    const query = getBoardQuery(id);
    await queryClient.cancelQueries(query);
    const prevData = queryClient.getQueryData<{ board: BoardType }>(query);
    return prevData?.board;
  };

  const updateBoardColumns = (id: string, columns: ColumnType[]) => {
    queryClient.setQueryData<{ board: BoardType } | undefined>(
      getBoardQuery(id),
      (old: { board: BoardType } | undefined) => {
        if (old)
          return {
            board: {
              ...old.board,
              columns,
            },
          };

        return old;
      },
    );
  };

  const setQueryDataAddComment = (data: AddCommentDto) => {
    const newUser = {
      id: user?.id,
      firstName: user?.firstName,
      lastName: user?.lastName,
    } as User;

    queryClient.setQueryData<{ board: BoardType } | undefined>(
      getBoardQuery(data.boardId),
      (old: { board: BoardType } | undefined) => {
        if (old) {
          const boardData = handleAddComments(old.board, data, newUser);
          return {
            board: {
              ...boardData,
              columns: boardData.columns,
            },
          };
        }

        return old;
      },
    );
  };

  const addCommentInCard = useMutation(addCommentRequest, {
    onMutate: async (data) => {
      setQueryDataAddComment(data);
      return { previousBoard: null, data };
    },
    onSettled: (data, error, variables) => {
      if (!error) {
        variables.newComment = data;
        setQueryDataAddComment(variables);
      }
    },
    onError: (data, variables) => {
      queryClient.invalidateQueries(['board', { id: variables.boardId }]);
      setToastState({
        open: true,
        content: 'Error adding the comment',
        type: ToastStateEnum.ERROR,
      });
    },
  });

  const deleteComment = useMutation(deleteCommentRequest, {
    onMutate: async (data) => {
      const board = await getPrevData(data.boardId);

      if (board) {
        const boardData = handleDeleteComments(board, data);
        updateBoardColumns(data.boardId, boardData.columns);
      }

      return { previousBoard: board, data };
    },
    onError: (data, variables) => {
      queryClient.invalidateQueries(['board', { id: variables.boardId }]);
      setToastState({
        open: true,
        content: 'Error updating the comment',
        type: ToastStateEnum.ERROR,
      });
    },
  });

  const updateComment = useMutation(updateCommentRequest, {
    onMutate: async (data) => {
      const board = await getPrevData(data.boardId);

      if (board) {
        const boardData = handleUpdateComments(board, data);
        updateBoardColumns(data.boardId, boardData.columns);
      }

      return { previousBoard: board, data };
    },
    onError: (data, variables) => {
      queryClient.invalidateQueries(['board', { id: variables.boardId }]);
      setToastState({
        open: true,
        content: 'Error updating the comment',
        type: ToastStateEnum.ERROR,
      });
    },
  });

  return {
    addCommentInCard,
    deleteComment,
    updateComment,
    setQueryDataAddComment,
  };
};

export default useComments;
