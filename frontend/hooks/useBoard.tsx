import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { BoardType, UseBoardType } from "../types/boardTypes";
import { Nullable } from "../types/commonTypes";
import fetchData from "../utils/fetchData";

export const postBoard = async (newBoard: BoardType): Promise<BoardType> => {
  return fetchData(
    `https://dc2021-570aa-default-rtdb.europe-west1.firebasedatabase.app/boards.json`,
    "POST",
    JSON.stringify(newBoard)
  );
};

export const getBoard = async (id: Nullable<string>): Promise<BoardType> => {
  return fetchData(
    `https://dc2021-570aa-default-rtdb.europe-west1.firebasedatabase.app/boards/${id}.json`,
    "GET",
    null
  );
};

const useBoard = (): UseBoardType => {
  const router = useRouter();

  const createBoard = useMutation(postBoard, {
    onSuccess: (data: BoardType) => {
      router.push(`/boards/${data.name}`);
    },
  });

  return { createBoard };
};

export default useBoard;
