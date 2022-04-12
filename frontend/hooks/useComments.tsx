import { useMutation } from "react-query";
import { addCommentRequest, deleteCommentRequest, updateCommentRequest } from "../api/boardService";

const useComments = () => {
  const addCommentInCard = useMutation(addCommentRequest, {
    onSuccess: () => {},
    onError: () => {},
  });

  const deleteComment = useMutation(deleteCommentRequest, {
    onSuccess: () => {},
    onError: () => {},
  });

  const updateComment = useMutation(updateCommentRequest, {
    onSuccess: () => {},
    onError: () => {},
  });

  return {
    addCommentInCard,
    deleteComment,
    updateComment,
  };
};

export default useComments;
