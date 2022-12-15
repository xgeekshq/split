/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation } from 'react-query';
import { useSession } from 'next-auth/react';

import { handleVotes } from '@/api/boardService';
import { CardItemType } from '@/types/card/cardItem';
import voteDto from '@/types/vote/vote.dto';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import isEmpty from '@/utils/isEmpty';
import BoardType from '../types/board/board';
import { getRemainingVotes } from '../utils/getRemainingVotes';
import useBoardUtils from './useBoardUtils';

enum Action {
  Add = 'add',
  Remove = 'remove',
}

type QueryKeyType = (string | { id: string })[];

type ToastStateType = {
  open: boolean;
  type: ToastStateEnum;
  content: string;
};

const useVotes = () => {
  const { queryClient, setToastState } = useBoardUtils();
  const { data: session } = useSession({ required: true });
  const userId = session?.user?.id || '';

  // work around to avoid read only error
  const getEditableBoardData = (board: BoardType): BoardType => JSON.parse(JSON.stringify(board));

  const getBoardQueryKey = (boardId = ''): QueryKeyType => ['board', { id: boardId }];

  const getFirstCardItemIndexWithVotes = (cardItems: CardItemType[]) =>
    cardItems.findIndex((cardItem) => cardItem.votes.length > 0);

  const getBoardDataQuery = (boardQueryKey: QueryKeyType): BoardType =>
    (queryClient.getQueryData(boardQueryKey) as { board: BoardType }).board;

  const getPreviousBoardData = (boardQueryKey: QueryKeyType) =>
    getEditableBoardData(getBoardDataQuery(boardQueryKey));

  const shallAddVote = (action: Action) => action === Action.Add;

  const hasMaxVotesLimit = ({ maxVotes }: BoardType) => !isEmpty(maxVotes);

  const addVoteToCardItemOptimistic = (prevBoardData: BoardType, indexes: number[]): BoardType => {
    const newBoardData = prevBoardData;
    const [colIndex, cardIndex, cardItemIndex] = indexes;

    newBoardData.columns[colIndex].cards[cardIndex].items[cardItemIndex].votes.push(userId);

    return newBoardData;
  };

  const removeVoteFromCardItemOptimistic = (prevBoardData: BoardType, indexes: number[]) => {
    const newBoardData = prevBoardData;
    const [colIndex, cardIndex, cardItemIndex] = indexes;

    prevBoardData.columns[colIndex].cards[cardIndex].items[cardItemIndex].votes.pop();

    return newBoardData;
  };

  const updateCardItemVoteOptimistic = (
    prevBoardData: BoardType,
    indexes: number[],
    action: Action,
  ) => {
    if (shallAddVote(action)) return addVoteToCardItemOptimistic(prevBoardData, indexes);

    return removeVoteFromCardItemOptimistic(prevBoardData, indexes);
  };

  const addVoteToCardsOptimistic = (
    prevBoardData: BoardType,
    indexes: number[],
    hasVotesOnCards: boolean,
  ): BoardType => {
    const newBoardData = prevBoardData;
    const [colIndex, cardIndex] = indexes;

    if (hasVotesOnCards) {
      newBoardData.columns[colIndex].cards[cardIndex].votes.push(userId);
    } else {
      newBoardData.columns[colIndex].cards[cardIndex].votes = [userId];
    }

    return newBoardData;
  };

  const removeVoteFromCardsOptimistic = (
    prevBoardData: BoardType,
    indexes: number[],
    hasVotesOnCards: boolean,
  ) => {
    const newBoardData = prevBoardData;
    const [colIndex, cardIndex] = indexes;

    if (hasVotesOnCards) {
      newBoardData.columns[colIndex].cards[cardIndex].votes.pop();

      return newBoardData;
    }

    const cardItems = newBoardData.columns[colIndex].cards[cardIndex].items;
    const cardItemIndex = getFirstCardItemIndexWithVotes(cardItems);
    const newIndexes = [colIndex, cardIndex, cardItemIndex];

    return updateCardItemVoteOptimistic(prevBoardData, newIndexes, Action.Remove);
  };

  const updateCardsVotesOptimistic = (
    prevBoardData: BoardType,
    indexes: number[],
    action: Action,
  ) => {
    const [colIndex, cardIndex] = indexes;
    const { votes: cardVotes } = prevBoardData.columns[colIndex].cards[cardIndex];
    const hasVotesOnCards = cardVotes && cardVotes.length > 0;

    if (shallAddVote(action)) {
      return addVoteToCardsOptimistic(prevBoardData, indexes, hasVotesOnCards);
    }

    return removeVoteFromCardsOptimistic(prevBoardData, indexes, hasVotesOnCards);
  };

  const updateCardOrCardIndexVotesOptimistic = (
    prevBoardData: BoardType,
    indexes: number[],
    isCardGroup: boolean,
    action: Action,
  ) => {
    if (isCardGroup) return updateCardsVotesOptimistic(prevBoardData, indexes, action);

    return updateCardItemVoteOptimistic(prevBoardData, indexes, action);
  };

  const updateBoardDataOptimistic = (
    prevBoardData: BoardType,
    voteData: voteDto,
    action: Action,
  ) => {
    const { cardId, cardItemId, isCardGroup } = voteData;

    const [colIndex, cardIndex, cardItemIndex] = [-1, -1, -1];
    let indexes = [colIndex, cardIndex, cardItemIndex];

    const foundCardItem = prevBoardData.columns.some((column, indexCol) =>
      column.cards.some(
        (card, indexCard) =>
          card._id === cardId &&
          card.items.some((cardItem, indexCardItem) => {
            const cardItemFound = isCardGroup || cardItem._id === cardItemId;

            if (cardItemFound) indexes = [indexCol, indexCard, indexCardItem];

            return cardItemFound;
          }),
      ),
    );

    if (foundCardItem) {
      return updateCardOrCardIndexVotesOptimistic(prevBoardData, indexes, isCardGroup, action);
    }

    return prevBoardData;
  };

  const updateVoteOptimistic = async (action: Action, voteData: voteDto) => {
    const boardQueryKey = getBoardQueryKey(voteData.boardId);

    await queryClient.cancelQueries(boardQueryKey);

    const prevBoardData: BoardType = getPreviousBoardData(boardQueryKey);

    const newBoardData = updateBoardDataOptimistic(prevBoardData, voteData, action);

    queryClient.setQueryData(boardQueryKey, { board: newBoardData });

    return { newBoardData, prevBoardData };
  };

  const addVoteOptimistic = async (voteData: voteDto) => updateVoteOptimistic(Action.Add, voteData);

  const removeVoteOptimistic = async (voteData: voteDto) =>
    updateVoteOptimistic(Action.Remove, voteData);

  const buildToastMessage = (
    toastMessage: string,
    toastStateType: ToastStateEnum,
  ): ToastStateType => ({ open: true, content: toastMessage, type: toastStateType });

  const toastErrorMessage = (errorMessage: string) =>
    setToastState(buildToastMessage(errorMessage, ToastStateEnum.ERROR));

  const toastInfoMessage = (toastMessage: string) =>
    setToastState(buildToastMessage(toastMessage, ToastStateEnum.INFO));

  const toastRemainingVotesMessage = (message: string, boardDataFromApi: BoardType | undefined) => {
    if (boardDataFromApi && hasMaxVotesLimit(boardDataFromApi)) {
      const remainingVotes = getRemainingVotes(boardDataFromApi, userId!);

      toastInfoMessage(`${message} You have ${remainingVotes} votes left.`);
    }
  };

  const restoreBoardDataAndToastError = (
    prevBoardData: BoardType | undefined,
    { boardId }: voteDto,
    errorMessage: string,
  ) => {
    queryClient.setQueryData(getBoardQueryKey(boardId), prevBoardData);

    toastErrorMessage(errorMessage);
  };

  const invalidateQueriesAndToastMessage = (
    boardDataFromApi: BoardType | undefined,
    message: string,
  ) => {
    queryClient.invalidateQueries(getBoardQueryKey(boardDataFromApi?._id));

    toastRemainingVotesMessage(message, boardDataFromApi);
  };

  const handleVote = useMutation(handleVotes, {
    onSuccess: (voteData, variables) => {
      if (voteData.maxVotes) {
        toastRemainingVotesMessage('', voteData);
      }
      queryClient.invalidateQueries(['board', { id: voteData?._id }]);
    },
    onError: (error, variables) => {
      queryClient.invalidateQueries(['board', { id: variables.boardId }]);
      setToastState({
        open: true,
        content: 'Error adding the vote',
        type: ToastStateEnum.ERROR,
      });
    },
  });

  return {
    handleVote,
  };
};

export default useVotes;
