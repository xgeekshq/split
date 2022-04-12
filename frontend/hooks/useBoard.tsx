import { useSetRecoilState } from "recoil";
import { useMutation, useQuery } from "react-query";
import BoardType from "../types/board/board";
import {
  deleteBoardRequest,
  getBoardRequest,
  createBoardRequest,
  updateBoardRequest,
} from "../api/boardService";
import UseBoardType from "../types/board/useBoard";
import { boardState } from "../store/board/atoms/board.atom";
import { ToastStateEnum } from "../utils/enums/toast-types";
import useBoardUtils from "./useBoardUtils";

interface AutoFetchProps {
  autoFetchBoard: boolean;
}

const useBoard = ({ autoFetchBoard }: AutoFetchProps): UseBoardType => {
  const { boardId, queryClient, setToastState, router } = useBoardUtils();

  const setBoard = useSetRecoilState(boardState);
  // #region BOARD

  const fetchBoard = useQuery(["board", { id: boardId }], () => getBoardRequest(boardId), {
    enabled: autoFetchBoard,
    refetchOnWindowFocus: false,
    onError: () => {
      setToastState({ open: true, content: "Error getting the board", type: ToastStateEnum.ERROR });
    },
  });

  const createBoard = useMutation(createBoardRequest, {
    onSuccess: (data: BoardType) => {
      router.push(`/boards/${data._id}`);
    },
    onError: () => {
      setToastState({
        open: true,
        content: "Error creating the board",
        type: ToastStateEnum.ERROR,
      });
    },
  });

  const deleteBoard = useMutation(deleteBoardRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries("boards");
      setToastState({
        open: true,
        content: "The board was successfully deleted.",
        type: ToastStateEnum.SUCCESS,
      });
    },
    onError: () => {
      setToastState({
        open: true,
        content: "Error deleting the board",
        type: ToastStateEnum.ERROR,
      });
    },
  });

  const updateBoard = useMutation(updateBoardRequest, {
    onSuccess: (board: BoardType) => {
      setBoard(board);
    },
    onError: () => {
      setToastState({
        open: true,
        content: "Error updating the board",
        type: ToastStateEnum.ERROR,
      });
    },
  });

  return {
    fetchBoard,
    createBoard,
    deleteBoard,
    updateBoard,
  };
};

export default useBoard;
