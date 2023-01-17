import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useSetRecoilState } from 'recoil';

import {
  handleDeleteCard,
  handleMergeCard,
  handleNewCard,
  handleUnMergeCard,
  handleUpdateCardPosition,
  handleUpdateText,
  removeReadOnly,
} from '@/helper/board/transformBoard';
import { mergeCardState } from '@/store/mergeCard/atoms/merge-card.atom';
import BoardType from '@/types/board/board';
import AddCardDto from '@/types/card/addCard.dto';
import ColumnType from '@/types/column';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import UpdateCardPositionDto from '@/types/card/updateCardPosition.dto';
import RemoveFromCardGroupDto from '@/types/card/removeFromCardGroup.dto';
import MergeCardsDto from '@/types/board/mergeCard.dto';
import DeleteCardDto from '@/types/card/deleteCard.dto';
import UpdateCardDto from '@/types/card/updateCard.dto';
import {
  addCardRequest,
  deleteCardRequest,
  mergeBoardRequest,
  mergeCardsRequest,
  removeFromMergeRequest,
  updateCardPositionRequest,
  updateCardRequest,
} from '../api/boardService';
import useBoardUtils from './useBoardUtils';

const useCards = () => {
  const { queryClient, setToastState } = useBoardUtils();
  const { data: session } = useSession({ required: false });

  const user = session?.user;

  const setMergeCard = useSetRecoilState(mergeCardState);

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

  const setQueryDataAddCard = (data: AddCardDto) => {
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
    const prevBoardData = await getPrevData(data.boardId);

    if (prevBoardData) {
      const newBoard = handleUpdateCardPosition(prevBoardData, data);
      updateBoardColumns(data.boardId, newBoard.columns);
    }

    return prevBoardData;
  };

  const updateCardPosition = useMutation(updateCardPositionRequest, {
    onMutate: async (data) => {
      const prevBoardData = setQueryDataUpdateCardPosition(data);

      return { previousBoard: prevBoardData, data };
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
  };

  const deleteCard = useMutation(deleteCardRequest, {
    onMutate: async (data) => {
      setQueryDataDeleteCard(data);
      return { previousBoard: null, data };
    },
    onSettled: () => {
      setToastState({
        open: true,
        type: ToastStateEnum.SUCCESS,
        content: 'Card deleted with success!',
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
        content: 'Error mergint the board',
        type: ToastStateEnum.ERROR,
      });
    },
  });

  // #region MERGE_CARDS

  const setQueryDataMergeCard = (data: MergeCardsDto) => {
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
  };

  const mergeCards = useMutation(mergeCardsRequest, {
    onMutate: async (data) => {
      const prevBoardData = await getPrevData(data.boardId);

      if (prevBoardData) {
        const boardData = handleMergeCard(prevBoardData, data);
        updateBoardColumns(data.boardId, boardData.columns);
      }

      return { previousBoard: prevBoardData, data };
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

  const handleMutateUnmergeOptimistic = async (data: RemoveFromCardGroupDto) => {
    const prevBoardData = await getPrevData(data.boardId);

    if (prevBoardData) {
      const boardData = handleUnMergeCard(prevBoardData, data);
      updateBoardColumns(data.boardId, boardData.columns);
    }

    return { previousBoard: prevBoardData, data };
  };

  const setQueryDataUnmergeCard = (data: RemoveFromCardGroupDto) => {
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
  };

  const handleUpdateCardItemIdOfUnmergedCard = (
    board: BoardType,
    variables: RemoveFromCardGroupDto,
  ): BoardType => {
    const mappedBoard = removeReadOnly(board);
    const column = mappedBoard.columns.find((col) => col._id === variables.columnId);
    const card = column?.cards.find((cardFound) => cardFound._id === variables.cardId);
    if (card && variables.newCardItemId) {
      card.items[0]._id = variables.newCardItemId;
    }

    return mappedBoard;
  };

  const removeFromMergeCard = useMutation(removeFromMergeRequest, {
    onMutate: async (data) => handleMutateUnmergeOptimistic(data),
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
