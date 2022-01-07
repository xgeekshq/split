import { Dispatch, SetStateAction } from "react";

export interface EditBoardTitle {
  isEditing: boolean;
  onClickEdit: Dispatch<SetStateAction<boolean>>;
}
