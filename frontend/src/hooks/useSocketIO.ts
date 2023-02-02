import { useEffect, useState } from 'react';

import { io, Socket } from 'socket.io-client';

import useCards from '@/hooks/useCards';
import BoardType from '@/types/board/board';
import MergeCardsDto from '@/types/board/mergeCard.dto';
import AddCardDto from '@/types/card/addCard.dto';
import DeleteCardDto from '@/types/card/deleteCard.dto';
import RemoveFromCardGroupDto from '@/types/card/removeFromCardGroup.dto';
import UpdateCardDto from '@/types/card/updateCard.dto';
import UpdateCardPositionDto from '@/types/card/updateCardPosition.dto';
import AddCommentDto from '@/types/comment/addComment.dto';
import DeleteCommentDto from '@/types/comment/deleteComment.dto';
import UpdateCommentDto from '@/types/comment/updateComment.dto';
import EmitEvent from '@/types/events/emit-event.type';
import EventCallback from '@/types/events/event-callback.type';
import ListenEvent from '@/types/events/listen-event.type';
import VoteDto from '@/types/vote/vote.dto';
import { NEXT_PUBLIC_BACKEND_URL } from '@/utils/constants';
import { useQueryClient } from '@tanstack/react-query';
import useComments from './useComments';
import useVotes from './useVotes';

interface SocketInterface {
  socketId?: string;
  listenEvent: ListenEvent;
  emitEvent: EmitEvent;
}

export const useSocketIO = (boardId: string): SocketInterface => {
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
      setQueryDataUpdateCardPosition(updateCardPositionDto);
    });

    socket?.on(`${boardId}vote`, (votesDto: VoteDto) => {
      updateVote(votesDto);
    });

    socket?.on(`${boardId}unmerge`, (unmergeDto: RemoveFromCardGroupDto) => {
      setQueryDataUnmergeCard(unmergeDto);
    });

    socket?.on(`${boardId}merge`, (mergeDto: MergeCardsDto) => {
      setQueryDataMergeCard(mergeDto);
    });

    socket?.on(`${boardId}addCard`, (addCardDto: AddCardDto) => {
      addCardDto.user = undefined;
      setQueryDataAddCard(addCardDto);
    });

    socket?.on(`${boardId}updateCard`, (updateCardDto: UpdateCardDto) => {
      setQueryDataUpdateCard(updateCardDto);
    });

    socket?.on(`${boardId}deleteCard`, (deleteCardDto: DeleteCardDto) => {
      setQueryDataDeleteCard(deleteCardDto);
    });

    socket?.on(`${boardId}addComment`, (addCommentDto: AddCommentDto) => {
      addCommentDto.fromSocket = true;
      setQueryDataAddComment(addCommentDto);
    });

    socket?.on(`${boardId}deleteComment`, (deleteCommentDto: DeleteCommentDto) => {
      setQueryDataDeleteComment(deleteCommentDto);
    });

    socket?.on(`${boardId}updateComment`, (updateCommentDto: UpdateCommentDto) => {
      setQueryDataUpdateComment(updateCommentDto);
    });
  }, [queryClient, socket, boardId]);

  const listenEvent = (eventName: string, callback: EventCallback) => {
    socket?.on(eventName, callback);
  };

  const emitEvent = (eventName: string, payload?: any) => {
    socket?.emit(eventName, payload);
  };

  return { socketId: socket?.id, listenEvent, emitEvent };
};
