import { atom } from "recoil";

export const boardState = atom<BoardInfoType>({
  key: "board",
  default: {},
});
