import { Dispatch, SetStateAction } from "react";

export default interface EditBoardTitle {
  isEditing: boolean;
  onClickEdit: Dispatch<SetStateAction<boolean>>;
}
