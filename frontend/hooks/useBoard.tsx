import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { BoardType, UseBoardType } from "../types/board";
import { postBoard, putBoard } from "../api/boardService";

const useBoard = (): UseBoardType => {
  const router = useRouter();

  const createBoard = useMutation(postBoard, {
    onSuccess: (data: BoardType) => {
      router.push(`/boards/${data._id}`);
      // update column order and card order
    },
  });

  const updateBoard = useMutation(putBoard, {});

  return { createBoard, updateBoard };
};

export default useBoard;
