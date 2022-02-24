import * as jsonPatch from "fast-json-patch";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import BoardType from "../../types/board/board";
import { Nullable } from "../../types/common";
import BoardChanges from "../../types/board/boardChanges";
import UpdateCardPositionDto from "../../types/card/updateCardPosition.dto";
import { handleUpdateCardPosition } from "../../helper/board/transformBoard";
import countVotes from "../../helper/board/votes";

interface BoardState {
  value: Nullable<BoardType>;
  votes: number;
}

interface BoardAction {
  board: BoardType;
  userId?: string;
}

const initialState: BoardState = {
  value: undefined,
  votes: 0,
};

export const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    setBoard: (state, action: PayloadAction<BoardAction>) => {
      const { board, userId } = action.payload;
      state.value = board;
      if (userId) state.votes = countVotes(board, userId);
    },
    setChangesBoard: (state, action: PayloadAction<BoardAction>) => {
      const { board, userId } = action.payload;
      if (state.value) {
        const operation = jsonPatch.compare(state.value, board);
        if (operation.length > 0)
          state.value = jsonPatch.applyPatch(state.value, operation).newDocument;
        if (userId) state.votes = countVotes(board, userId);
      }
    },
    clearBoard: (state) => {
      state.value = undefined;
    },
    setNewCardPosition: (state, action: PayloadAction<BoardChanges>) => {
      if (state.value) {
        const newBoard = handleUpdateCardPosition(
          state.value,
          action.payload as unknown as UpdateCardPositionDto
        );
        state.value = newBoard;
      }
    },
    setVotes: (state, action: PayloadAction<number>) => {
      state.votes = action.payload;
    },
    incrementVote: (state) => {
      state.votes += 1;
    },
    decrementVote: (state) => {
      state.votes -= 1;
    },
  },
});

export const {
  setBoard,
  setNewCardPosition,
  setChangesBoard,
  clearBoard,
  incrementVote,
  decrementVote,
} = boardSlice.actions;

export const selectBoard = (state: RootState): BoardState => state.board;

export default boardSlice.reducer;
