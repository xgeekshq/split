import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { io, Socket } from 'socket.io-client';

import { NEXT_PUBLIC_BACKEND_URL } from '@/utils/constants';
import UpdateCardPositionDto from '@/types/card/updateCardPosition.dto';
import useCards from '@/hooks/useCards';
import VoteDto from '@/types/vote/vote.dto';
import BoardType from '@/types/board/board';
import RemoveFromCardGroupDto from '@/types/card/removeFromCardGroup.dto';
import MergeCardsDto from '@/types/board/mergeCard.dto';
import AddCardDto from '@/types/card/addCard.dto';
import useVotes from './useVotes';

export const useSocketIO = (boardId: string): string | undefined => {
  const queryClient = useQueryClient();
  const [socket, setSocket] = useState<Socket | null>(null);
  const {
    updateCardPositionOptimistic,
    handleSetUnmergeQueryData,
    handleSetMergeQueryData,
    handleAddCardOptimistic,
    // handleDeleteCardOptimistic
  } = useCards();
  const { updateVote } = useVotes();

  useEffect(() => {
    const newSocket: Socket = io(NEXT_PUBLIC_BACKEND_URL ?? 'http://127.0.0.1:3200', {
      transports: ['polling'],
    });

    newSocket.on('connect', () => {
      newSocket.emit('join', { boardId });
      setSocket(newSocket);
    });

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [boardId, queryClient, setSocket]);

  useEffect(() => {
    socket?.on('updateAllBoard', () => {
      queryClient.invalidateQueries(['board', { id: boardId }]);
    });

    socket?.on('board', (board: BoardType) => {
      queryClient.setQueryData(['board', { id: boardId }], { board });
    });

    socket?.on(`${boardId}cardPosition`, (updateCardPositionDto: UpdateCardPositionDto) => {
      updateCardPositionOptimistic(updateCardPositionDto);
    });

    socket?.on(`${boardId}vote`, (votesDto: VoteDto) => {
      updateVote(votesDto);
    });

    socket?.on(`${boardId}unmerge`, (unmergeDto: RemoveFromCardGroupDto) => {
      handleSetUnmergeQueryData(unmergeDto);
    });

    socket?.on(`${boardId}merge`, (mergeDto: MergeCardsDto) => {
      handleSetMergeQueryData(mergeDto);
    });

    socket?.on(`${boardId}addCard`, (addCardDto: AddCardDto) => {
      handleAddCardOptimistic(addCardDto);
    });

    // socket?.on(`${boardId}deleteCard`, (deleteCardDto: DeleteCardDto) => {
    //   handleDeleteCardOptimistic(deleteCardDto);
    // });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryClient, socket]);

  return socket?.id;
};
