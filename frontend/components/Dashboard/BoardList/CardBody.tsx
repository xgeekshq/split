import React, { useState } from "react";
import Link from "next/link";
import {
  HoverCardTrigger,
  HoverCardContent,
  HoverCardArrow,
  HoverCardRoot,
} from "../../Primitives/HoverCard";
import BoardType from "../../../types/board/board";
import { ColumnType } from "../../../types/column/column";
import Card from "../../Primitives/Card";
import Flex from "../../Primitives/Flex";
import CardHeader from "./CardHeader";
import { styled } from "../../../stitches.config";
import Shape from "../../Primitives/Shape";
import Text from "../../Primitives/Text";
import InputTitle from "../../Title/InputTitle";

const Circle = styled(Shape, {
  size: "$32",
});

const handleCols = (columns: ColumnType[]) => {
  return columns.map((column) => {
    const trigger = (
      <Circle
        variant="circle"
        align="center"
        justify="center"
        css={{
          color: "white",
          backgroundColor: column.color === undefined ? "gray" : column.color,
        }}
      >
        {column.cards.length}
      </Circle>
    );
    return (
      <HoverCardRoot key={column._id}>
        <HoverCardTrigger asChild>{trigger}</HoverCardTrigger>
        <HoverCardContent sideOffset={0}>
          {column.title}
          <HoverCardArrow />
        </HoverCardContent>
      </HoverCardRoot>
    );
  });
};

const CardBody: React.FC<{ board: BoardType }> = ({ board }) => {
  const [showEditTitle, setShowEditTitle] = useState(false);
  return (
    <Link key={board._id} href={{ pathname: `boards/[boardId]`, query: { boardId: board._id } }}>
      <Card
        css={{ size: "$220", px: "$20", py: "$8", pointerEvents: showEditTitle ? "none" : "all" }}
        direction="column"
        align="center"
        justify="start"
        gap="26"
        radius="40"
        interactive="clickable"
      >
        <CardHeader board={board} isEditing={showEditTitle} onClickEdit={setShowEditTitle} />
        {showEditTitle ? (
          <InputTitle board={board} onClickEdit={setShowEditTitle} isBoardPage={false} />
        ) : (
          <Text size="20" fontWeight="bold">
            {board.title}
          </Text>
        )}
        <Text>{board.creationDate?.substr(0, 10)}</Text>
        {board.columns && <Flex gap="8">{handleCols(board.columns)}</Flex>}
      </Card>
    </Link>
  );
};

export default CardBody;
