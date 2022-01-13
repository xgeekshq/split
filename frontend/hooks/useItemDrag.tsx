import { useEffect } from "react";
import { ConnectDragSource, useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { DragItem } from "../types/card/dragItem";

const useItemDrag = (
  dragItem: DragItem
): { isDragging: unknown; drag: ConnectDragSource; item: DragItem } => {
  const [{ isDragging, item }, drag, preview] = useDrag({
    type: dragItem.type,
    item: () => {
      return dragItem;
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      item: monitor.getItem(),
    }),
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);
  return { isDragging, drag, item };
};

export default useItemDrag;
