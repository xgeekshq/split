import { configureStore } from "@reduxjs/toolkit";
import boardSlicer from "./slicer/boardSlicer";

const store = configureStore({
  reducer: {
    board: boardSlicer,
  },
});

export default store;

export const selectBoard = (state: RootState) => state.board;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
