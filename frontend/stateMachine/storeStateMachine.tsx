import { Dispatch, Reducer, useReducer } from "react";
import transformBoard from "../helper/transformBoard";
import { Nullable } from "../types/common";

export type State<BoardT, SocketT, ActionT> = {
  board: Nullable<BoardT>;
  socket: Nullable<SocketT>;
  action: Nullable<ActionT>;
};

export type Event<BoardT, SocketT, ActionT> =
  | { type: "SET_BOARD"; val: Nullable<BoardT> }
  | {
      type: "SET_SOCKET";
      val: Nullable<SocketT>;
    }
  | {
      type: "UPDATE_CARD_POSITION";
      val: Nullable<ActionT>;
    };

function storeReducer<BoardT, SocketT, ActionT>(
  state: State<BoardT, SocketT, ActionT>,
  event: Event<BoardT, SocketT, ActionT>
): State<BoardT, SocketT, ActionT> {
  switch (event.type) {
    case "UPDATE_CARD_POSITION": {
      const { board } = state;
      const newBoard = transformBoard(board, event.val);
      return { ...state, board: newBoard as unknown as BoardT, action: event.val };
    }
    case "SET_BOARD": {
      return { ...state, board: event.val };
    }
    case "SET_SOCKET": {
      return { ...state, socket: event.val };
    }
    default: {
      throw new Error(`Unhandled event type: ${event}`);
    }
  }
}

function useStateMachine<BoardT, SocketT, ActionT>(): [
  State<BoardT, SocketT, ActionT>,
  Dispatch<Event<BoardT, SocketT, ActionT>>
] {
  const initialState: State<BoardT, SocketT, ActionT> = {
    board: undefined,
    socket: undefined,
    action: undefined,
  };

  return useReducer<Reducer<State<BoardT, SocketT, ActionT>, Event<BoardT, SocketT, ActionT>>>(
    storeReducer,
    initialState
  );
}

export default useStateMachine;
