import { BoardType, ColumnType } from "../../../types/boardTypes";
import Card from "../../Primitives/Card";
import { styled } from "../../../stitches.config";
import Flex from "../../Primitives/Flex";
import Text from "../../Primitives/Text";
import Shape from "../../Primitives/Shape";
import CardHeader from "./CardHeader";
import HoverCard from "../../Primitives/HoverCard";

const Container = styled("div", Flex);

const Circle = styled(Shape, {
  size: "$32",
});

// ##### to refactor when we have our backend
const handleCols = (columns: ColumnType) => {
  return Object.keys(columns).map((key) => {
    const trigger = (
      <Circle
        variant="circle"
        align="center"
        justify="center"
        css={{
          color: "white",
          backgroundColor: columns[key].color === undefined ? "gray" : columns[key].color,
        }}
      >
        {Object.keys(columns[key].cards).length}
      </Circle>
    );
    return (
      <HoverCard key={key} trigger={trigger}>
        {key}
      </HoverCard>
    );
  });
};
// #####

const BoardsList: React.FC<{ boards: BoardType }> = ({ boards }) => {
  return (
    <Container gap="40" justify="start">
      {Object.keys(boards).map((key) => (
        // to refactor title key when the backend is implemented
        <Card
          key={boards[key].title}
          css={{ size: "$220", px: "$20", py: "$8" }}
          direction="column"
          align="center"
          justify="start"
          gap="26"
        >
          <CardHeader />
          <Text size="20" fontWeight="bold">
            {boards[key].title}
          </Text>
          <Text>{boards[key].creationDate}</Text>
          {boards[key].columns && <Container gap="8">{handleCols(boards[key].columns)}</Container>}
        </Card>
      ))}
    </Container>
  );
};

export default BoardsList;
