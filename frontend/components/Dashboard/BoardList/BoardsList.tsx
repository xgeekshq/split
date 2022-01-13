import BoardType from "../../../types/board/board";
import Flex from "../../Primitives/Flex";
import CardBody from "./CardBody";

const BoardsList: React.FC<{ boards: BoardType[] }> = ({ boards }) => {
  return (
    <Flex gap="40" justify="start">
      {boards.map((board: BoardType) => (
        <CardBody key={board._id} board={board} />
      ))}
    </Flex>
  );
};

export default BoardsList;
