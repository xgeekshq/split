import React, { Dispatch, useContext, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { io, Socket } from "socket.io-client";
import { Nullable } from "../types/common";
import useStateMachine, { State, Event } from "../stateMachine/storeStateMachine";
import BoardType from "../types/board/board";
import { NEXT_PUBLIC_BACKEND_URL } from "../utils/constants";
import { CheckIsBoardPage } from "../utils/routes";
import Action from "../types/action";

type ContextType = {
  state: State<BoardType, Socket, Action>;
  dispatch: Dispatch<Event<BoardType, Socket, Action>>;
};

const Context = React.createContext<Nullable<ContextType>>(undefined);

const StoreProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useStateMachine<BoardType, Socket, Action>();
  const router = useRouter();

  useEffect(() => {
    if (CheckIsBoardPage(router.pathname) && state.board && !state.socket) {
      const socket: Socket = io(NEXT_PUBLIC_BACKEND_URL ?? "http://127.0.0.1:3200");
      dispatch({
        type: "SET_SOCKET",
        val: socket,
      });
    }

    if (!CheckIsBoardPage(router.pathname)) {
      state.socket?.close();
      dispatch({ type: "SET_SOCKET", val: undefined });
    }
  }, [router, dispatch, state.board, state.socket]);

  useEffect(() => {
    if (state.socket) {
      state.socket?.on("connect", () => {
        state.socket?.emit("join", { boardId: state.board?._id });
      });
      state.socket?.on("updateAllBoard", (payload: BoardType) => {
        dispatch({ type: "SET_BOARD", val: payload as unknown as BoardType });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.socket]);

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

const useStoreContext = (): ContextType => {
  const context = useContext(Context);
  if (context === undefined || context === null) {
    throw new Error("useStoreContext must be used within a StoreProvider");
  }
  return context;
};

export { StoreProvider, useStoreContext };
