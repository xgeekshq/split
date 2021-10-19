import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { BoardType, UseBoardType } from "../types/boardTypes";
import { postBoard } from "../api/boardService";

const useBoard = (): UseBoardType => {
  const router = useRouter();

  const createBoard = useMutation(postBoard, {
    onSuccess: (data: BoardType) => {
      router.push(`/boards/${data.id}`);
      // update column order and card order
    },
  });

  return { createBoard };
};

export default useBoard;
