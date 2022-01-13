import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";
import ToastMessage from "../utils/toast";
import BoardType from "../types/board/board";
import {
  deleteBoardRequest,
  getBoardRequest,
  getBoardsRequest,
  createBoardRequest,
  updateCardPositionRequest,
  updateBoardRequest,
} from "../api/boardService";
import UseBoardType from "../types/board/useBoard";
import { useStoreContext } from "../store/store";

interface AutoFetchProps {
  autoFetchBoard: boolean;
  autoFetchBoards: boolean;
}

const useBoard = (
  { autoFetchBoard = false, autoFetchBoards = false }: AutoFetchProps,
  boardId?: string
): UseBoardType => {
  const router = useRouter();
  const { dispatch } = useStoreContext();

  // #region BOARD

  const fetchBoard = useQuery(
    ["board", { id: boardId }],
    () => (boardId ? getBoardRequest(boardId) : null),
    {
      enabled: autoFetchBoard,
      refetchOnWindowFocus: autoFetchBoard,
    }
  );

  const fetchBoards = useQuery("boards", () => getBoardsRequest(), {
    enabled: autoFetchBoards,
    refetchOnWindowFocus: autoFetchBoards,
  });

  const createBoard = useMutation(createBoardRequest, {
    onSuccess: (data: BoardType) => {
      router.push(`/boards/${data._id}`);
    },
    onError: () => {
      ToastMessage("Board not created!", "error");
    },
  });

  const deleteBoard = useMutation(deleteBoardRequest, {
    onSuccess: () => {
      ToastMessage("Board deleted!", "success");
      fetchBoards.refetch();
    },
    onError: () => {
      ToastMessage("Board not deleted!", "error");
    },
  });

  const updateBoard = useMutation(updateBoardRequest, {
    onSuccess: (board: BoardType, variables) => {
      ToastMessage("Board updated!", "success");
      if (!variables.boardPage) {
        fetchBoards.refetch();
      } else {
        dispatch({ type: "SET_BOARD", val: board });
      }
    },
    onError: () => {
      ToastMessage("Board not updated!", "error");
    },
  });

  // #endregion

  // #region CARD

  const updateCardPosition = useMutation(updateCardPositionRequest, {
    onSuccess: (board: BoardType) => {
      dispatch({ type: "SET_BOARD", val: board });
    },
    onError: () => {
      ToastMessage("Board not updated!", "error");
      fetchBoards.refetch();
    },
  });

  // #endregion

  return { fetchBoard, fetchBoards, createBoard, deleteBoard, updateBoard, updateCardPosition };
};

export default useBoard;
