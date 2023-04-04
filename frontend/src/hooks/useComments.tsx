import { useMutation } from '@tanstack/react-query';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';

import {
  handleAddComments,
  handleDeleteComments,
  handleUpdateComments,
} from '@/helper/board/transformBoard';
import BoardType from '@/types/board/board';
import AddCommentDto from '@/types/comment/addComment.dto';
import DeleteCommentDto from '@/types/comment/deleteComment.dto';
import UpdateCommentDto from '@/types/comment/updateComment.dto';
import { operationsQueueAtom } from '@/store/operations/atom/operations-queue.atom';
import { useSetRecoilState } from 'recoil';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import useBoardUtils from '@/hooks/useBoardUtils';
import { addCommentRequest, deleteCommentRequest, updateCommentRequest } from '@/api/boardService';

const useComments = () => {
  const { queryClient, setToastState } = useBoardUtils();
  const { data: session } = useSession({ required: false });
  const setReady = useSetRecoilState(operationsQueueAtom);

  const user = session?.user;

  const getBoardQuery = (id: string | undefined) => ['board', { id }];

  const setQueryDataAddComment = (data: AddCommentDto) => {
    const newUser = {
      id: user?.id,
      firstName: user?.firstName,
      lastName: user?.lastName,
    } as User;
    setReady(false);
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
    setReady(true);
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

  const setQueryDataDeleteComment = (data: DeleteCommentDto) => {
    setReady(false);
    queryClient.setQueryData<{ board: BoardType } | undefined>(
      getBoardQuery(data.boardId),
      (old: { board: BoardType } | undefined) => {
        if (old) {
          const boardData = handleDeleteComments(old.board, data);
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
    setReady(true);
  };

  const deleteComment = useMutation(deleteCommentRequest, {
    onMutate: async (data) => {
      setQueryDataDeleteComment(data);

      return { previousBoard: null, data };
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

  const setQueryDataUpdateComment = (data: UpdateCommentDto) => {
    setReady(false);
    queryClient.setQueryData<{ board: BoardType } | undefined>(
      getBoardQuery(data.boardId),
      (old: { board: BoardType } | undefined) => {
        if (old) {
          const boardData = handleUpdateComments(old.board, data);
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
    setReady(true);
  };

  const updateComment = useMutation(updateCommentRequest, {
    onMutate: async (data) => {
      setQueryDataUpdateComment(data);

      return { previousBoard: null, data };
    },
    onError: (_, variables) => {
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
    setQueryDataDeleteComment,
    setQueryDataUpdateComment,
  };
};

export default useComments;
