import React from "react";
import { XYCoord, useDragLayer } from "react-dnd";
import { styled } from "../../stitches.config";
import CardBoard from "./Card/CardBoard";

const CustomDragLayerContainer = styled("div", {
  height: "100%",
  left: "0",
  pointerEvents: "none",
  position: "fixed",
  top: 0,
  width: "30%",
  zIndex: 100,
});

function getItemStyles(currentOffset: XYCoord | null): React.CSSProperties {
  if (!currentOffset) {
    return {
      display: "none",
    };
  }
  const { x, y } = currentOffset;
  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
    WebkitTransform: transform,
  };
}

const CustomDragLayer: React.FC = () => {
  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging) {
    return null;
  }

  const renderItem = () => {
    if (!item.card.items || item.card.items.length === 1) {
      return (
        <CardBoard
          colId={item.columnId}
          isPreview
          card={item.card}
          index={item.index}
          color={item.color}
          cardGroupId={item.cardGroupId}
          userId={item.userId}
        />
      );
    }

    return null;
  };

  return (
    <CustomDragLayerContainer>
      <div style={getItemStyles(currentOffset)}>{renderItem()}</div>
    </CustomDragLayerContainer>
  );
};

export default CustomDragLayer;
