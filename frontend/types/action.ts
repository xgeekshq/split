import { BoardChanges } from "./board/boardChanges";

interface Action {
  type: string;
  changes: BoardChanges;
}

export default Action;
