import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useMutation, useQuery } from "react-query";
import ToastMessage from "../utils/toast";
import { BoardType } from "../types/board";
import {
  deleteBoard,
  getBoard,
  getBoards,
  getBoardWithAuth,
  postBoard,
  updateBoardTitle,
} from "../api/boardService";
import UseBoardType from "../types/useBoard";
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
  const { data: session } = useSession({ required: false });
  const { dispatch } = useStoreContext();

  const getBoardMethod = () => {
    if (!boardId) return null;
    return session ? getBoardWithAuth(boardId) : getBoard(boardId);
  };

  const fetchBoard = useQuery(["board", { id: boardId }], () => getBoardMethod(), {
    enabled: autoFetchBoard,
    refetchOnWindowFocus: autoFetchBoard,
  });

  const fetchBoards = useQuery("boards", () => getBoards(), {
    enabled: autoFetchBoards,
    refetchOnWindowFocus: autoFetchBoards,
  });

  const createBoard = useMutation(postBoard, {
    onSuccess: (data: BoardType) => {
      router.push(`/boards/${data._id}`);
    },
    onError: () => {
      ToastMessage("Board not created!", "error");
    },
  });

  const removeBoard = useMutation(deleteBoard, {
    onSuccess: () => {
      ToastMessage("Board deleted!", "success");
      fetchBoards.refetch();
    },
    onError: () => {
      ToastMessage("Board not deleted!", "error");
    },
  });

  const patchBoardTitle = useMutation(updateBoardTitle, {
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

  return { createBoard, patchBoardTitle, removeBoard, fetchBoards, fetchBoard };
};

export default useBoard;
