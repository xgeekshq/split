import { atom } from "recoil";

export const createBoardState = atom({
  key: "showCreateBoard",
  default: false,
});
