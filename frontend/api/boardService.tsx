import { v4 as uuidv4 } from "uuid";
import fetchData from "../utils/fetchData";
import { BoardType, BoardTypeWithToken } from "../types/board";
import { Nullable } from "../types/common";
import ColumnType from "../types/column";
import CardType from "../types/card";

const transformBoard = (board: BoardType) => {
  const newBoard = { ...board };
  const newCols = board.columns.map((column: ColumnType) => {
    const cards = column.cards.map((card: CardType) => {
      return { ...card, _id: uuidv4() };
    });
    return { ...column, cards, _id: uuidv4() };
  });
  newBoard.columns = newCols;
  return newBoard;
};

export const postBoard = ({ newBoard, token }: BoardTypeWithToken): Promise<BoardType> => {
  return fetchData(`/boards`, "POST", JSON.stringify(newBoard), token);
};

export const putBoard = ({ newBoard, token }: BoardTypeWithToken): Promise<BoardType> => {
  return fetchData(`/boards/${newBoard._id}`, "PUT", JSON.stringify(newBoard), token);
};

export const getBoard = async (id: Nullable<string>): Promise<BoardType> => {
  const board = await fetchData<BoardType>(`/boards/${id}`, "POST", undefined, undefined);
  return transformBoard(board);
};

export const getBoards = (token: Nullable<string>): Promise<BoardType[]> => {
  return fetchData(`/boards`, "GET", undefined, token);
};
