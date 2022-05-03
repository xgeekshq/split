import { selector } from "recoil";
import { createBoardDataState } from "../../createBoard/atoms/create-board.atom";
import { boardState } from "../atoms/board.atom";

export const getBoardSelector = selector({
  key: "getBoard", // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    return get(boardState);
  },
});

export const getCreateBoardSelector = selector({
  key: "getCreateBoard", // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    return get(createBoardDataState);
  },
});
