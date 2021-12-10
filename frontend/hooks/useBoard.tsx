import { useRouter } from "next/router";
import { useMutation, useQuery } from "react-query";
import { useSession } from "next-auth/react";
import { BoardType } from "../types/board";
import { getBoard, getBoards, getBoardWithAuth, postBoard } from "../api/boardService";
import UseBoardType from "../types/useBoard";

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

  const getBoardMethod = () => {
    if (!boardId) return null;
    return session
      ? getBoardWithAuth({ id: boardId, token: session.accessToken })
      : getBoard(boardId);
  };

  const fetchBoard = useQuery(["board", { id: boardId }], () => getBoardMethod(), {
    enabled: autoFetchBoard,
    refetchOnWindowFocus: autoFetchBoard,
  });

  const fetchBoards = useQuery("boards", () => getBoards(session?.accessToken), {
    enabled: autoFetchBoards,
    refetchOnWindowFocus: autoFetchBoards,
  });

  const createBoard = useMutation(postBoard, {
    onSuccess: (data: BoardType) => {
      router.push(`/boards/${data._id}`);
      // update column order and card order
    },
  });

  return { createBoard, fetchBoards, fetchBoard };
};

export default useBoard;
