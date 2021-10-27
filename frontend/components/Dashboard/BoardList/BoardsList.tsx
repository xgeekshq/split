import Link from "next/link";
import { BoardType, ColumnType } from "../../../types/boardTypes";
import Card from "../../Primitives/Card";
import { styled } from "../../../stitches.config";
import Flex from "../../Primitives/Flex";
import Text from "../../Primitives/Text";
import Shape from "../../Primitives/Shape";
import CardHeader from "./CardHeader";
import HoverCard from "../../Primitives/HoverCard";

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
      <HoverCard key={column.id} trigger={trigger}>
        {column.title}
      </HoverCard>
    );
  });
};

const BoardsList: React.FC<{ boards: BoardType[] }> = ({ boards }) => {
  return (
    <Flex gap="40" justify="start">
      {boards.map((board: BoardType) => (
        <Link key={board.id} href={`boards/${board.id}`}>
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
