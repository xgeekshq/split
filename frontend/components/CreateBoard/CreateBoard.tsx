import { useSetRecoilState } from "recoil";
import { styled } from "../../stitches.config";
import { createBoardState } from "../../store/createBoard/atoms/create-board.atom";
import CrossIcon from "../icons/CrossIcon";
import Button from "../Primitives/Button";
import Flex from "../Primitives/Flex";
import Separator from "../Primitives/Separator";
import Text from "../Primitives/Text";
import CreateBoardContent from "./Content/Content";
import CreateBoardTipBar from "./TipBar";

const MainContainter = styled(Flex, {
  backgroundColor: "white",
  width: "100%",
  maxHeight: "100vh",
});

const CreateBoard: React.FC = () => {
  const setCreateBoardState = useSetRecoilState(createBoardState);

  return (
    <MainContainter direction="column">
      <Flex
        justify="between"
        align="center"
        css={{ px: "$40", py: "$32", backgroundColor: "white", width: "100%", maxHeight: "$92" }}
      >
        <Text heading="3">Add new SPLIT board</Text>
        <Button
          css={{ "& svg": { size: "$40 !important", color: "$primary800" } }}
          isIcon
          onClick={() => setCreateBoardState(false)}
        >
          <CrossIcon size="24" />
        </Button>
      </Flex>
      <Separator orientation="horizontal" css={{ backgroundColor: "$primary100" }} />
      <Flex justify="between" css={{ overflow: "hidden", height: "100%" }}>
        <CreateBoardContent setOpened={setCreateBoardState} />
        <CreateBoardTipBar />
      </Flex>
    </MainContainter>
  );
};

export default CreateBoard;
