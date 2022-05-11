import { useMutation } from "react-query";
import { addCommentRequest, deleteCommentRequest, updateCommentRequest } from "../api/boardService";
import { ToastStateEnum } from "../utils/enums/toast-types";
import useBoardUtils from "./useBoardUtils";

const useComments = () => {
  const { queryClient, setToastState } = useBoardUtils();

  const addCommentInCard = useMutation(addCommentRequest, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(["board", { id: data?._id }]);
    },
    onError: () => {
      setToastState({
        open: true,
        content: "Error adding the comment",
        type: ToastStateEnum.ERROR,
      });
    },
  });

  const deleteComment = useMutation(deleteCommentRequest, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(["board", { id: data?._id }]);
    },
    onError: () => {
      setToastState({
        open: true,
        content: "Error deleting the comment",
        type: ToastStateEnum.ERROR,
      });
    },
  });

  const updateComment = useMutation(updateCommentRequest, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(["board", { id: data?._id }]);
    },
    onError: () => {
      setToastState({
        open: true,
        content: "Error updating the comment",
        type: ToastStateEnum.ERROR,
      });
    },
  });

  return {
    addCommentInCard,
    deleteComment,
    updateComment,
  };
};

export default useComments;
