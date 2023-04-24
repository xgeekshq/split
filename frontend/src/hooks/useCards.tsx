import { useSession } from 'next-auth/react';
import { useMutation } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';

import {
  addCardRequest,
  deleteCardRequest,
  mergeBoardRequest,
  mergeCardsRequest,
  removeFromMergeRequest,
  updateCardPositionRequest,
  updateCardRequest,
} from '@/api/boardService';
import { ToastStateEnum } from '@/enums/toasts/toast-types';
import {
  handleDeleteCard,
  handleMergeCard,
  handleNewCard,
  handleUnMergeCard,
  handleUpdateCardItemIdOfUnmergedCard,
  handleUpdateCardPosition,
  handleUpdateText,
} from '@/helper/board/transformBoard';
import useBoardUtils from '@/hooks/useBoardUtils';
import { mergeCardState } from '@/store/mergeCard/atoms/merge-card.atom';
import { operationsQueueAtom } from '@/store/operations/atom/operations-queue.atom';
import BoardType from '@/types/board/board';
import MergeCardsDto from '@/types/board/mergeCard.dto';
import AddCardDto from '@/types/card/addCard.dto';
import DeleteCardDto from '@/types/card/deleteCard.dto';
import RemoveFromCardGroupDto from '@/types/card/removeFromCardGroup.dto';
import UpdateCardDto from '@/types/card/updateCard.dto';
import UpdateCardPositionDto from '@/types/card/updateCardPosition.dto';

const useCards = () => {
  const { queryClient, setToastState } = useBoardUtils();
  const { data: session } = useSession({ required: false });

  const user = session?.user;

  const setMergeCard = useSetRecoilState(mergeCardState);
  const setReady = useSetRecoilState(operationsQueueAtom);

  const getBoardQuery = (id: string | undefined) => ['board', { id }];

  const setQueryDataAddCard = (data: AddCardDto) => {
    setReady(false);
    queryClient.setQueryData<{ board: BoardType } | undefined>(
      getBoardQuery(data.boardId),
      (old: { board: BoardType } | undefined) => {
        if (old) {
          const boardData = handleNewCard(old.board, data.colIdToAdd, data);
          return {
            board: {
              ...old.board,
              columns: boardData.columns,
            },
          };
        }

        return old;
      },
    );
    setReady(true);
  };

  const addCardInColumn = useMutation(addCardRequest, {
    onMutate: async (data) => {
      if (user) {
        data.user = { ...user, joinedAt: '', _id: user?.id };
        setQueryDataAddCard(data);
      }
    },
    onSettled: (data, error, variables) => {
      if (!error) {
        variables.newCard = data;
        setQueryDataAddCard(variables);
      }
    },
    onError: (_, variables) => {
      queryClient.invalidateQueries(getBoardQuery(variables.boardId));
      setToastState({
        open: true,
        content: 'Error adding the card',
        type: ToastStateEnum.ERROR,
      });
    },
  });

  const setQueryDataUpdateCardPosition = async (data: UpdateCardPositionDto) => {
    setReady(false);
    queryClient.setQueryData<{ board: BoardType } | undefined>(
      getBoardQuery(data.boardId),
      (old: { board: BoardType } | undefined) => {
        if (old) {
          const newBoard = handleUpdateCardPosition(old.board, data);
          return {
            board: {
              ...old.board,
              columns: newBoard.columns,
            },
          };
        }

        return old;
      },
    );

    setReady(true);
  };

  const updateCardPosition = useMutation(updateCardPositionRequest, {
    onMutate: async (data) => {
      setQueryDataUpdateCardPosition(data);
    },
    onError: (data, variables) => {
      queryClient.invalidateQueries(getBoardQuery(variables.boardId));
      setToastState({
        open: true,
        content: 'Error updating the card position',
        type: ToastStateEnum.ERROR,
      });
    },
  });

  const setQueryDataUpdateCard = (data: UpdateCardDto) => {
    setReady(false);
    queryClient.setQueryData<{ board: BoardType } | undefined>(
      getBoardQuery(data.boardId),
      (old: { board: BoardType } | undefined) => {
        if (old) {
          const boardData = handleUpdateText(old.board, data);
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

  const updateCard = useMutation(updateCardRequest, {
    onMutate: async (data) => {
      setQueryDataUpdateCard(data);
      return { previousBoard: null, data };
    },
    onError: (data, variables) => {
      queryClient.invalidateQueries(getBoardQuery(variables.boardId));
      setToastState({
        open: true,
        content: 'Error updating the card',
        type: ToastStateEnum.ERROR,
      });
    },
  });

  const setQueryDataDeleteCard = (data: DeleteCardDto) => {
    setReady(false);
    queryClient.setQueryData<{ board: BoardType } | undefined>(
      getBoardQuery(data.boardId),
      (old: { board: BoardType } | undefined) => {
        if (old) {
          const boardData = handleDeleteCard(old.board, data);
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

  const deleteCard = useMutation(deleteCardRequest, {
    onMutate: async (data) => {
      setQueryDataDeleteCard(data);
      return { previousBoard: null, data };
    },
    onSuccess: () => {
      setToastState({
        open: true,
        type: ToastStateEnum.SUCCESS,
        content: 'Card deleted!',
      });
    },
    onError: (_, variables) => {
      queryClient.invalidateQueries(getBoardQuery(variables.boardId));
      setToastState({
        open: true,
        content: 'Error deleting the card',
        type: ToastStateEnum.ERROR,
      });
    },
  });

  const mergeBoard = useMutation(mergeBoardRequest, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(getBoardQuery(variables.subBoardId));
    },
    onError: () => {
      setToastState({
        open: true,
        content: 'Error merging the board',
        type: ToastStateEnum.ERROR,
      });
    },
  });

  // #region MERGE_CARDS

  const setQueryDataMergeCard = (data: MergeCardsDto) => {
    setReady(false);
    queryClient.setQueryData<{ board: BoardType } | undefined>(
      getBoardQuery(data.boardId),
      (old: { board: BoardType } | undefined) => {
        if (old) {
          const boardData = handleMergeCard(old.board, data);
          return {
            board: {
              ...old.board,
              columns: boardData.columns,
            },
          };
        }

        return old;
      },
    );
    setReady(true);
  };

  const mergeCards = useMutation(mergeCardsRequest, {
    onMutate: async (data) => {
      setQueryDataMergeCard(data);
    },
    onError: (data, variables) => {
      queryClient.invalidateQueries(getBoardQuery(variables.boardId));
      setMergeCard(undefined);
      setToastState({
        open: true,
        content: 'Error merging the cards',
        type: ToastStateEnum.ERROR,
      });
    },
  });

  const setQueryDataUnmergeCard = (data: RemoveFromCardGroupDto) => {
    setReady(false);
    queryClient.setQueryData<{ board: BoardType } | undefined>(
      getBoardQuery(data.boardId),
      (old: { board: BoardType } | undefined) => {
        if (old) {
          const boardData = handleUnMergeCard(old.board, data);
          return {
            board: {
              ...old.board,
              columns: boardData.columns,
            },
          };
        }

        return old;
      },
    );
    setReady(true);
  };

  const removeFromMergeCard = useMutation(removeFromMergeRequest, {
    onMutate: async (data) => {
      setQueryDataUnmergeCard(data);
    },
    onSettled: async (data, error, variables) => {
      if (!error) {
        variables.newCardItemId = data;
        queryClient.setQueryData<{ board: BoardType } | undefined>(
          getBoardQuery(variables.boardId),
          (old: { board: BoardType } | undefined) => {
            if (old) {
              const newBoard = handleUpdateCardItemIdOfUnmergedCard(old.board, variables);
              return {
                board: {
                  ...old.board,
                  columns: newBoard.columns,
                },
              };
            }
            return old;
          },
        );
      }
    },
    onError: (data, variables) => {
      queryClient.invalidateQueries(getBoardQuery(variables.boardId));
      setToastState({
        open: true,
        content: 'Error unmerge the card',
        type: ToastStateEnum.ERROR,
      });
    },
  });

  // #endregion

  return {
    addCardInColumn,
    updateCardPosition,
    updateCard,
    deleteCard,
    mergeCards,
    removeFromMergeCard,
    mergeBoard,
    setQueryDataUpdateCardPosition,
    setQueryDataUnmergeCard,
    setQueryDataMergeCard,
    setQueryDataAddCard,
    setQueryDataDeleteCard,
    setQueryDataUpdateCard,
  };
};

export default useCards;
