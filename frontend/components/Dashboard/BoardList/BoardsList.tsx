import Link from "next/link";
import { Boards, BoardType } from "../../../types/board";
import {
  HoverCardRoot,
  HoverCardContent,
  HoverCardArrow,
  HoverCardTrigger,
} from "../../Primitives/HoverCard";
import Card from "../../Primitives/Card";
import { styled } from "../../../stitches.config";
import Flex from "../../Primitives/Flex";
import Text from "../../Primitives/Text";
import Shape from "../../Primitives/Shape";
import CardHeader from "./CardHeader";
import ColumnType from "../../../types/column";

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
        {column.cardsOrder.length}
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

const BoardsList: React.FC<Boards> = ({ boards }) => {
  return (
    <Flex gap="40" justify="start">
      {boards.map((board: BoardType) => (
        <Link key={board._id} href={`boards/${board._id}`}>
          <Card
            css={{ size: "$220", px: "$20", py: "$8" }}
            direction="column"
            align="center"
            justify="start"
            gap="26"
            radius="40"
            interactive="clickable"
          >
            <CardHeader />
            <Text size="20" fontWeight="bold">
              {board.title}
            </Text>
            <Text>{board.creationDate}</Text>
            {board.columns && <Flex gap="8">{handleCols(board.columns)}</Flex>}
          </Card>
        </Link>
      ))}
    </Flex>
  );
};

export default BoardsList;
