import * as jsonPatch from "fast-json-patch";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import BoardType from "../../types/board/board";
import { Nullable } from "../../types/common";
import BoardChanges from "../../types/board/boardChanges";
import UpdateCardPositionDto from "../../types/card/updateCardPosition.dto";
import { handleUpdateCardPosition } from "../../helper/transformBoard";

interface BoardState {
  value: Nullable<BoardType>;
}

const initialState: BoardState = {
  value: undefined,
};

export const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    setBoard: (state, action: PayloadAction<Nullable<BoardType>>) => {
      state.value = action.payload;
    },
    setChangesBoard: (state, action: PayloadAction<BoardType>) => {
      if (state.value) {
        const operation = jsonPatch.compare(state.value, action.payload);
        if (operation.length > 0)
          state.value = jsonPatch.applyPatch(state.value, operation).newDocument;
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
  },
});

export const { setBoard, setNewCardPosition, setChangesBoard, clearBoard } = boardSlice.actions;

export const selectBoard = (state: RootState): BoardState => state.board;

export default boardSlice.reducer;
