import { atom } from "recoil";
import { BoardInfoType } from "../../../types/board/board";

export const boardState = atom<BoardInfoType | undefined>({
  key: "board",
  default: undefined,
});
