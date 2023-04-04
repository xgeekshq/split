import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

import { handleVotes } from '@/api/boardService';
import { CardItemType } from '@/types/card/cardItem';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import isEmpty from '@/utils/isEmpty';
import VoteDto from '@/types/vote/vote.dto';
import { operationsQueueAtom } from '@/store/operations/atom/operations-queue.atom';
import { useSetRecoilState } from 'recoil';
import { getRemainingVotes } from '@/utils/getRemainingVotes';
import useBoardUtils from '@/hooks/useBoardUtils';
import BoardType from '../types/board/board';

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
  const { data: session } = useSession({ required: false });
  const userId = session?.user?.id || '';

  const setReady = useSetRecoilState(operationsQueueAtom);

  // work around to avoid read only error
  const getEditableBoardData = (board: BoardType): BoardType => JSON.parse(JSON.stringify(board));

  const getBoardQueryKey = (boardId = ''): QueryKeyType => ['board', { id: boardId }];

  const getFirstCardItemIndexWithVotes = (cardItems: CardItemType[], userIdOfVote: string) =>
    cardItems.findIndex((cardItem) => cardItem.votes.includes(userIdOfVote));

  const getBoardDataQuery = (boardQueryKey: QueryKeyType): BoardType =>
    (queryClient.getQueryData(boardQueryKey) as { board: BoardType }).board;

  const getPreviousBoardData = (boardQueryKey: QueryKeyType) =>
    getEditableBoardData(getBoardDataQuery(boardQueryKey));

  const shallAddVote = (action: Action) => action === Action.Add;

  const hasMaxVotesLimit = ({ maxVotes }: BoardType) => !isEmpty(maxVotes);

  const addVoteToCardItemOptimistic = (
    prevBoardData: BoardType,
    indexes: number[],
    userIdOfVote: string,
  ): BoardType => {
    const newBoardData = prevBoardData;
    const [colIndex, cardIndex, cardItemIndex] = indexes;

    newBoardData.columns[colIndex].cards[cardIndex].items[cardItemIndex].votes.push(userIdOfVote);

    return newBoardData;
  };

  const removeVoteFromCardItemOptimistic = (
    prevBoardData: BoardType,
    indexes: number[],
    userIdOfVote: string,
  ) => {
    const newBoardData = prevBoardData;
    const [colIndex, cardIndex, cardItemIndex] = indexes;

    const index =
      newBoardData.columns[colIndex].cards[cardIndex].items[cardItemIndex].votes.indexOf(
        userIdOfVote,
      );

    if (index >= 0) {
      newBoardData.columns[colIndex].cards[cardIndex].items[cardItemIndex].votes.splice(index, 1);
    }

    return newBoardData;
  };

  const updateBoardUser = (
    boardData: BoardType,
    action: Action,
    currentUser: string,
    count: number,
  ) => {
    boardData.users = boardData.users.map((boardUser) => {
      if (boardUser.user?._id !== currentUser) return boardUser;

      return {
        ...boardUser,
        votesCount: boardUser.votesCount + count,
      };
    });
  };

  const updateCardItemVoteOptimistic = (
    prevBoardData: BoardType,
    indexes: number[],
    action: Action,
    userIdOfVote: string,
  ) => {
    if (shallAddVote(action))
      return addVoteToCardItemOptimistic(prevBoardData, indexes, userIdOfVote);

    return removeVoteFromCardItemOptimistic(prevBoardData, indexes, userIdOfVote);
  };

  const addVoteToCardsOptimistic = (
    prevBoardData: BoardType,
    indexes: number[],
    hasVotesOnCards: boolean,
    userIdOfVote: string,
  ): BoardType => {
    const newBoardData = prevBoardData;
    const [colIndex, cardIndex] = indexes;

    if (hasVotesOnCards) {
      newBoardData.columns[colIndex].cards[cardIndex].votes.push(userIdOfVote);
    } else {
      newBoardData.columns[colIndex].cards[cardIndex].votes = [userIdOfVote];
    }

    return newBoardData;
  };

  const removeVoteFromCardsOptimistic = (
    prevBoardData: BoardType,
    indexes: number[],
    hasVotesOnCards: boolean,
    userIdOfVote: string,
  ) => {
    const newBoardData = prevBoardData;
    const [colIndex, cardIndex] = indexes;

    if (
      hasVotesOnCards &&
      newBoardData.columns[colIndex].cards[cardIndex].votes.includes(userIdOfVote)
    ) {
      const voteIndex = newBoardData.columns[colIndex].cards[cardIndex].votes.indexOf(userIdOfVote);
      if (voteIndex >= 0) {
        newBoardData.columns[colIndex].cards[cardIndex].votes.splice(voteIndex, 1);
      }

      return newBoardData;
    }

    const cardItems = newBoardData.columns[colIndex].cards[cardIndex].items;
    const cardItemIndex = getFirstCardItemIndexWithVotes(cardItems, userIdOfVote);
    const newIndexes = [colIndex, cardIndex, cardItemIndex];

    return updateCardItemVoteOptimistic(prevBoardData, newIndexes, Action.Remove, userIdOfVote);
  };

  const updateCardsVotesOptimistic = (
    prevBoardData: BoardType,
    indexes: number[],
    action: Action,
    userIdOfVote: string,
  ) => {
    const [colIndex, cardIndex] = indexes;
    const { votes: cardVotes } = prevBoardData.columns[colIndex].cards[cardIndex];
    const hasVotesOnCards = cardVotes && cardVotes.length > 0;

    if (shallAddVote(action)) {
      return addVoteToCardsOptimistic(prevBoardData, indexes, hasVotesOnCards, userIdOfVote);
    }

    return removeVoteFromCardsOptimistic(prevBoardData, indexes, hasVotesOnCards, userIdOfVote);
  };

  const updateCardOrCardIndexVotesOptimistic = (
    prevBoardData: BoardType,
    indexes: number[],
    isCardGroup: boolean,
    action: Action,
    userIdOfVote: string,
    count: number,
    fromRequest: boolean,
  ) => {
    let board = prevBoardData;
    let countAbs = Math.abs(count);
    while (countAbs !== 0) {
      if (isCardGroup) {
        board = updateCardsVotesOptimistic(board, indexes, action, userIdOfVote);
      } else {
        board = updateCardItemVoteOptimistic(board, indexes, action, userIdOfVote);
      }

      if (fromRequest) {
        countAbs = 0;
      } else {
        countAbs -= 1;
      }
    }

    return board;
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
        voteData.userId,
        count,
        voteData.fromRequest,
      );

      const currentCount = count > 0 ? 1 : -1;
      updateBoardUser(
        newBoard,
        count > 0 ? Action.Add : Action.Remove,
        voteData.userId,
        voteData.fromRequest ? currentCount : count,
      );

      return newBoard;
    }

    return prevBoardData;
  };

  const updateVoteOptimistic = async (action: Action, voteData: VoteDto) => {
    const boardQueryKey = getBoardQueryKey(voteData.boardId);

    const prevBoardData: BoardType = getPreviousBoardData(boardQueryKey);

    if (prevBoardData.hideVotes && voteData.userId !== userId) {
      return prevBoardData;
    }

    const newBoardData = updateBoardDataOptimistic(prevBoardData, voteData, action);

    queryClient.setQueryData(boardQueryKey, { board: newBoardData });

    return newBoardData;
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
    setReady(false);
    const newBoardData = await updateVoteOptimistic(
      variables.count > 0 ? Action.Add : Action.Remove,
      variables,
    );
    setReady(true);

    if (newBoardData?.maxVotes && variables.userId === userId) {
      toastRemainingVotesMessage('', newBoardData);
    }
  };

  const handleVote = useMutation(handleVotes, {
    onError: (_, variables) => {
      queryClient.cancelQueries(['board', { id: variables.boardId }]);
      queryClient.invalidateQueries(['board', { id: variables.boardId }]);
      setReady(true);
      toastErrorMessage(`Error ${variables.count > 0 ? 'adding' : 'removing'} the vote`);
    },
  });

  return {
    handleVote,
    toastInfoMessage,
    updateVote,
  };
};

export default useVotes;
