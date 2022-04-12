import { useMutation } from "react-query";
import {
  addCardRequest,
  updateCardPositionRequest,
  updateCardRequest,
  deleteCardRequest,
  mergeCardsRequest,
  removeFromMergeRequest,
} from "../api/boardService";

const useCards = () => {
  const addCardInColumn = useMutation(addCardRequest, {
    onSuccess: () => {},
    onError: () => {},
  });

  const updateCardPosition = useMutation(updateCardPositionRequest, {
    onSuccess: () => {},
    onError: () => {},
  });

  const updateCard = useMutation(updateCardRequest, {
    onSuccess: () => {},
    onError: () => {},
  });

  const deleteCard = useMutation(deleteCardRequest, {
    onSuccess: () => {},
    onError: () => {},
  });

  // #region MERGE_CARDS

  const mergeCards = useMutation(mergeCardsRequest, {
    onSuccess: () => {},
    onError: () => {},
  });

  const removeFromMergeCard = useMutation(removeFromMergeRequest, {
    onSuccess: () => {},
    onError: () => {},
  });

  // #endregion

  return {
    addCardInColumn,
    updateCardPosition,
    updateCard,
    deleteCard,
    mergeCards,
    removeFromMergeCard,
  };
};

export default useCards;
