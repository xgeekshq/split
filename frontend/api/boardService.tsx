import { GetServerSidePropsContext } from "next";
import fetchData from "../utils/fetchData";
import BoardType, { CreateBoardDto, GetBoardResponse } from "../types/board/board";
import UpdateCardPositionDto from "../types/card/updateCardPosition.dto";
import UpdateBoardDto from "../types/board/updateBoard";
import AddCardDto from "../types/card/addCard.dto";
import DeleteCardDto from "../types/card/deleteCard.dto";
import UpdateCardDto from "../types/card/updateCard.dto";
import AddCommentDto from "../types/comment/addComment.dto";
import DeleteCommentDto from "../types/comment/deleteComment.dto";
import UpdateCommentDto from "../types/comment/updateComment.dto";
import VoteDto from "../types/vote/vote.dto";
import MergeCardsDto from "../types/board/mergeCard.dto";
import RemoveFromCardGroupDto from "../types/card/removeFromCardGroup.dto";

// #region BOARD

export const createBoardRequest = (newBoard: CreateBoardDto): Promise<BoardType> => {
  return fetchData(`/boards`, { method: "POST", data: newBoard });
};

export const updateBoardRequest = ({ board }: UpdateBoardDto): Promise<BoardType> => {
  return fetchData(`/boards/${board._id}`, { method: "PUT", data: board });
};

export const getBoardRequest = (
  id: string,
  context?: GetServerSidePropsContext
): Promise<GetBoardResponse> => {
  return fetchData<GetBoardResponse>(`/boards/${id}`, { context, serverSide: !!context });
};

export const getStakeholders = (context?: GetServerSidePropsContext): Promise<string[]> => {
  return fetchData<string[]>(`/boards/stakeholders/all`, { context, serverSide: !!context });
};

export const getDashboardBoardsRequest = (
  pageParam: number,
  context?: GetServerSidePropsContext
): Promise<{ boards: BoardType[]; hasNextPage: boolean; page: number }> => {
  return fetchData(`/boards/dashboard?page=${pageParam ?? 0}&size=10`, {
    context,
    serverSide: !!context,
  });
};

export const getBoardsRequest = (
  pageParam: number,
  context?: GetServerSidePropsContext
): Promise<{ boards: BoardType[]; hasNextPage: boolean; page: number }> => {
  return fetchData(`/boards?page=${pageParam ?? 0}&size=10`, { context, serverSide: !!context });
};

export const deleteBoardRequest = async (id: string): Promise<BoardType> => {
  return fetchData(`/boards/${id}`, { method: "DELETE" });
};

// #endregion

// #region CARD

export const addCardRequest = (addCardDto: AddCardDto): Promise<BoardType> => {
  return fetchData<BoardType>(`/boards/${addCardDto.boardId}/card`, {
    method: "POST",
    data: addCardDto,
  });
};

export const updateCardRequest = (updateCard: UpdateCardDto): Promise<BoardType> => {
  return fetchData<BoardType>(
    updateCard.isCardGroup
      ? `/boards/${updateCard.boardId}/card/${updateCard.cardId}`
      : `/boards/${updateCard.boardId}/card/${updateCard.cardId}/items/${updateCard.cardItemId}`,
    { method: "PUT", data: updateCard }
  );
};

export const mergeBoardRequest = (subBoardId: string): Promise<BoardType> => {
  return fetchData<BoardType>(`/boards/${subBoardId}/merge`, { method: "PUT" });
};

export const updateCardPositionRequest = (
  updateCardPosition: UpdateCardPositionDto
): Promise<BoardType> => {
  return fetchData<BoardType>(
    `/boards/${updateCardPosition.boardId}/card/${updateCardPosition.cardId}/updateCardPosition`,
    { method: "PUT", data: updateCardPosition }
  );
};

export const deleteCardRequest = (deleteCardDto: DeleteCardDto): Promise<BoardType> => {
  return fetchData<BoardType>(
    deleteCardDto.isCardGroup
      ? `/boards/${deleteCardDto.boardId}/card/${deleteCardDto.cardId}`
      : `/boards/${deleteCardDto.boardId}/card/${deleteCardDto.cardId}/items/${deleteCardDto.cardItemId}`,
    {
      method: "DELETE",
      data: deleteCardDto,
    }
  );
};

// #endregion

// #region MERGE_CARDS
export const mergeCardsRequest = (mergeCard: MergeCardsDto): Promise<BoardType> => {
  return fetchData<BoardType>(
    `/boards/${mergeCard.boardId}/card/${mergeCard.cardId}/merge/${mergeCard.cardGroupId}`,
    { method: "PUT", data: mergeCard }
  );
};

export const removeFromMergeRequest = (
  removeFromMerge: RemoveFromCardGroupDto
): Promise<BoardType> => {
  return fetchData<BoardType>(
    `/boards/${removeFromMerge.boardId}/card/${removeFromMerge.cardGroupId}/cardItem/${removeFromMerge.cardId}/removeFromCardGroup`,
    { method: "PUT", data: removeFromMerge }
  );
};

// #endregion

// #region COMMENT
export const addCommentRequest = (addCommentDto: AddCommentDto): Promise<BoardType> => {
  return fetchData<BoardType>(
    addCommentDto.isCardGroup
      ? `/boards/${addCommentDto.boardId}/card/${addCommentDto.cardId}/comment`
      : `/boards/${addCommentDto.boardId}/card/${addCommentDto.cardId}/items/${addCommentDto.cardItemId}/comment`,
    { method: "POST", data: addCommentDto }
  );
};

export const updateCommentRequest = (updateCommentDto: UpdateCommentDto): Promise<BoardType> => {
  return fetchData<BoardType>(
    updateCommentDto.isCardGroup
      ? `/boards/${updateCommentDto.boardId}/card/${updateCommentDto.cardId}/comment/${updateCommentDto.commentId}`
      : `/boards/${updateCommentDto.boardId}/card/${updateCommentDto.cardId}/items/${updateCommentDto.cardItemId}/comment/${updateCommentDto.commentId}`,
    { method: "PUT", data: updateCommentDto }
  );
};

export const deleteCommentRequest = (deleteCommentDto: DeleteCommentDto): Promise<BoardType> => {
  return fetchData<BoardType>(
    deleteCommentDto.isCardGroup
      ? `/boards/${deleteCommentDto.boardId}/card/${deleteCommentDto.cardId}/comment/${deleteCommentDto.commentId}`
      : `/boards/${deleteCommentDto.boardId}/card/${deleteCommentDto.cardId}/items/${deleteCommentDto.cardItemId}/comment/${deleteCommentDto.commentId}`,
    { method: "DELETE", data: deleteCommentDto }
  );
};

// #endregion

// #region VOTES
export const addVoteRequest = (voteDto: VoteDto): Promise<BoardType> => {
  return fetchData<BoardType>(
    voteDto.isCardGroup
      ? `/boards/${voteDto.boardId}/card/${voteDto.cardId}/vote`
      : `/boards/${voteDto.boardId}/card/${voteDto.cardId}/items/${voteDto.cardItemId}/vote`,
    { method: "POST", data: voteDto }
  );
};

export const deleteVoteRequest = (voteDto: VoteDto): Promise<BoardType> => {
  return fetchData<BoardType>(
    voteDto.isCardGroup
      ? `/boards/${voteDto.boardId}/card/${voteDto.cardId}/vote`
      : `/boards/${voteDto.boardId}/card/${voteDto.cardId}/items/${voteDto.cardItemId}/vote`,
    { method: "DELETE", data: voteDto }
  );
};
// #endregion
