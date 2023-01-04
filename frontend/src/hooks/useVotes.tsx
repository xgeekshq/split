/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation } from 'react-query';
import { useSession } from 'next-auth/react';

import { handleVotes } from '@/api/boardService';
import { CardItemType } from '@/types/card/cardItem';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import isEmpty from '@/utils/isEmpty';
import VoteDto from '@/types/vote/vote.dto';
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

  const setPreviousBoardQuery = (id: string, context: any) => {
    queryClient.setQueryData(
      getBoardQueryKey(id),
      (context as { previousBoard: BoardType }).previousBoard,
    );
  };

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

  const updateBoardUser = (boardData: BoardType, action: Action) => {
    boardData.users = boardData.users.map((boardUser) => {
      if (boardUser.user._id !== userId) return boardUser;

      return {
        ...boardUser,
        votesCount: action === Action.Add ? boardUser.votesCount + 1 : boardUser.votesCount - 1,
      };
    });
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
    voteData: VoteDto,
    action: Action,
  ) => {
    const { cardId, cardItemId, isCardGroup, count } = voteData;

    const [colIndex, cardIndex, cardItemIndex] = [-1, -1, -1];
    let indexes = [colIndex, cardIndex, cardItemIndex];

    const foundCardItem = prevBoardData.columns.some((column, indexCol) =>
      column.cards.some(
        (card, indexCard) =>
          card._id === cardId &&
          card.items.some((cardItem, indexCardItem) => {
            const cardItemFound: boolean = isCardGroup || cardItem._id === cardItemId;

            if (cardItemFound) indexes = [indexCol, indexCard, indexCardItem];

            return cardItemFound;
          }),
      ),
    );

    if (foundCardItem) {
      const newBoard = updateCardOrCardIndexVotesOptimistic(
        prevBoardData,
        indexes,
        isCardGroup,
        action,
      );
      updateBoardUser(newBoard, count > 0 ? Action.Add : Action.Remove);

      return newBoard;
    }

    return prevBoardData;
  };

  const updateVoteOptimistic = async (action: Action, voteData: VoteDto) => {
    const boardQueryKey = getBoardQueryKey(voteData.boardId);

    await queryClient.cancelQueries(boardQueryKey);

    const prevBoardData: BoardType = getPreviousBoardData(boardQueryKey);

    const newBoardData = updateBoardDataOptimistic(prevBoardData, voteData, action);

    queryClient.setQueryData(boardQueryKey, { board: newBoardData });

    return { newBoardData, prevBoardData };
  };

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

  const updateVote = async (variables: VoteDto) => {
    const { newBoardData } = await updateVoteOptimistic(
      variables.count > 0 ? Action.Add : Action.Remove,
      variables,
    );

    if (newBoardData?.maxVotes && newBoardData) {
      toastRemainingVotesMessage('', newBoardData);
    }
  };

  const handleVote = useMutation(handleVotes, {
    onSuccess: async (_, variables) => {
      queryClient.invalidateQueries(['board', { id: variables.boardId }]);
    },
    onError: (_, variables, context) => {
      queryClient.invalidateQueries(['board', { id: variables.boardId }]);
      toastErrorMessage(`Error ${variables.count > 0 ? 'adding' : 'removing'} the vote`);
    },
  });

  return {
    handleVote,
    toastInfoMessage,
  };
};

export default useVotes;
