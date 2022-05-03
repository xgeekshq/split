import { atom } from "recoil";
import BoardType from "../../../types/board/board";

export const boardState = atom<BoardType | undefined>({
  key: "board",
  default: undefined,
});
