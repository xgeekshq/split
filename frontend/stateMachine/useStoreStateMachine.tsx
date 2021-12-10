import { Dispatch, Reducer, useReducer } from "react";
import transformBoard from "../helper/transformBoard";
import { Nullable } from "../types/common";

export type State<BoardT, DragItem, SocketT> = {
  board: Nullable<BoardT>;
  draggedItem: Nullable<DragItem>;

  socket: Nullable<SocketT>;
};

export type Event<BoardT, DragItem, SocketT, BoardChangesT> =
  | { type: "SET_BOARD"; val: Nullable<BoardT> }
  | { type: "CARD" | "COLUMN"; val: BoardChangesT }
  | {
      type: "SET_DRAGGED_ITEM";
      val: DragItem | undefined;
    }
  | {
      type: "SET_SOCKET";
      val: Nullable<SocketT>;
    }
  | {
      type: "SET_SOCKET_UPDATE";
      val: { socket: SocketT; sendUpdate: BoardChangesT };
    };

function useStateMachine<BoardT, DragItem, SocketT, BoardChangesT>(
  initialBoard: Nullable<BoardT>
): [State<BoardT, DragItem, SocketT>, Dispatch<Event<BoardT, DragItem, SocketT, BoardChangesT>>] {
  const initialState: State<BoardT, DragItem, SocketT> = {
    board: initialBoard,
    draggedItem: undefined,
    socket: undefined,
  };

  function storeReducer(
    state: State<BoardT, DragItem, SocketT>,
    event: Event<BoardT, DragItem, SocketT, BoardChangesT>
  ): State<BoardT, DragItem, SocketT> {
    switch (event.type) {
      case "SET_BOARD": {
        return { ...state, board: event.val };
      }
      case "COLUMN": {
        const newBoard = transformBoard(state.board, {
          ...event.val,
        });
        return { ...state, board: newBoard as unknown as BoardT };
      }
      case "SET_DRAGGED_ITEM": {
        return { ...state, draggedItem: event.val };
      }
      case "CARD": {
        const newBoard = transformBoard(state.board, {
          ...event.val,
        });
        return { ...state, board: newBoard as unknown as BoardT };
      }
      case "SET_SOCKET": {
        return { ...state, socket: event.val };
      }
      default: {
        throw new Error(`Unhandled event type: ${event}`);
      }
    }
  }

  return useReducer<
    Reducer<State<BoardT, DragItem, SocketT>, Event<BoardT, DragItem, SocketT, BoardChangesT>>
  >(storeReducer, initialState);
}

export default useStateMachine;
