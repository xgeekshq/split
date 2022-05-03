import { DragItem } from "../types/card/dragItem";
import { Nullable } from "../types/common";

const isHidden = (
  isPreview: boolean | undefined,
  draggedItem: Nullable<DragItem>,
  itemType: string,
  id: string
): boolean => {
  return Boolean(
    !isPreview && draggedItem && draggedItem.type === itemType && draggedItem.card._id === id
  );
};

export default isHidden;
