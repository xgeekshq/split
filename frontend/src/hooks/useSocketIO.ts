import { useEffect, useState } from 'react';

import { io, Socket } from 'socket.io-client';

import { NEXT_PUBLIC_BACKEND_URL } from '@/utils/constants';
import UpdateCardPositionDto from '@/types/card/updateCardPosition.dto';
import useCards from '@/hooks/useCards';
import VoteDto from '@/types/vote/vote.dto';
import BoardType from '@/types/board/board';
import RemoveFromCardGroupDto from '@/types/card/removeFromCardGroup.dto';
import MergeCardsDto from '@/types/board/mergeCard.dto';
import AddCardDto from '@/types/card/addCard.dto';
import DeleteCardDto from '@/types/card/deleteCard.dto';
import UpdateCardDto from '@/types/card/updateCard.dto';
import AddCommentDto from '@/types/comment/addComment.dto';
import UpdateCommentDto from '@/types/comment/updateComment.dto';
import DeleteCommentDto from '@/types/comment/deleteComment.dto';
import { useQueryClient } from '@tanstack/react-query';
import isEmpty from '@/utils/isEmpty';
import { useRecoilValue } from 'recoil';
import { operationsQueueAtom } from '@/store/operations/atom/operations-queue.atom';
import useComments from './useComments';
import useVotes from './useVotes';

enum BoardAction {
  UPDATECARDPOSITION,
  VOTE,
  UNMERGE,
  MERGE,
  ADDCARD,
  UPDATECARD,
  DELETECARD,
  ADDCOMMENT,
  DELETECOMMENT,
  UPDATECOMMENT,
}

export const useSocketIO = (boardId: string): string | undefined => {
  const queryClient = useQueryClient();
  const [socket, setSocket] = useState<Socket | null>(null);
  const {
    setQueryDataUpdateCardPosition,
    setQueryDataUnmergeCard,
    setQueryDataMergeCard,
    setQueryDataAddCard,
    setQueryDataDeleteCard,
    setQueryDataUpdateCard,
  } = useCards();
  const { updateVote } = useVotes();
  const { setQueryDataAddComment, setQueryDataDeleteComment, setQueryDataUpdateComment } =
    useComments();

  const [queue, setQueue] = useState<{ action: BoardAction; dto: any }[]>([]);
  const ready = useRecoilValue(operationsQueueAtom);

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
      setQueue((prev) => [
        ...prev,
        { action: BoardAction.UPDATECARDPOSITION, dto: updateCardPositionDto },
      ]);
    });

    socket?.on(`${boardId}vote`, (votesDto: VoteDto) => {
      setQueue((prev) => [...prev, { action: BoardAction.VOTE, dto: votesDto }]);
    });

    socket?.on(`${boardId}unmerge`, (unmergeDto: RemoveFromCardGroupDto) => {
      setQueue((prev) => [...prev, { action: BoardAction.UNMERGE, dto: unmergeDto }]);
    });

    socket?.on(`${boardId}merge`, (mergeDto: MergeCardsDto) => {
      setQueue((prev) => [...prev, { action: BoardAction.MERGE, dto: mergeDto }]);
    });

    socket?.on(`${boardId}addCard`, (addCardDto: AddCardDto) => {
      addCardDto.user = undefined;
      setQueue((prev) => [...prev, { action: BoardAction.ADDCARD, dto: addCardDto }]);
    });

    socket?.on(`${boardId}updateCard`, (updateCardDto: UpdateCardDto) => {
      setQueue((prev) => [...prev, { action: BoardAction.UPDATECARD, dto: updateCardDto }]);
    });

    socket?.on(`${boardId}deleteCard`, (deleteCardDto: DeleteCardDto) => {
      setQueue((prev) => [...prev, { action: BoardAction.DELETECARD, dto: deleteCardDto }]);
    });

    socket?.on(`${boardId}addComment`, (addCommentDto: AddCommentDto) => {
      addCommentDto.fromSocket = true;
      setQueue((prev) => [...prev, { action: BoardAction.ADDCOMMENT, dto: addCommentDto }]);
    });

    socket?.on(`${boardId}deleteComment`, (deleteCommentDto: DeleteCommentDto) => {
      setQueue((prev) => [...prev, { action: BoardAction.DELETECOMMENT, dto: deleteCommentDto }]);
    });

    socket?.on(`${boardId}updateComment`, (updateCommentDto: UpdateCommentDto) => {
      setQueue((prev) => [...prev, { action: BoardAction.UPDATECOMMENT, dto: updateCommentDto }]);
    });
  }, [queryClient, socket, boardId]);

  useEffect(() => {
    if (!isEmpty(queue) && ready) {
      switch (queue[0].action) {
        case BoardAction.UPDATECARDPOSITION:
          setQueryDataUpdateCardPosition(queue[0].dto);
          break;
        case BoardAction.VOTE:
          updateVote(queue[0].dto);
          break;
        case BoardAction.UNMERGE:
          setQueryDataUnmergeCard(queue[0].dto);
          break;
        case BoardAction.MERGE:
          setQueryDataMergeCard(queue[0].dto);
          break;
        case BoardAction.ADDCARD:
          setQueryDataAddCard(queue[0].dto);
          break;
        case BoardAction.UPDATECARD:
          setQueryDataUpdateCard(queue[0].dto);
          break;
        case BoardAction.DELETECARD:
          setQueryDataDeleteCard(queue[0].dto);
          break;
        case BoardAction.ADDCOMMENT:
          setQueryDataAddComment(queue[0].dto);
          break;
        case BoardAction.DELETECOMMENT:
          setQueryDataDeleteComment(queue[0].dto);
          break;
        case BoardAction.UPDATECOMMENT:
          setQueryDataUpdateComment(queue[0].dto);
          break;
        default:
          break;
      }
      queue.splice(0, 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId, queryClient, queue, ready]);

  return socket?.id;
};
