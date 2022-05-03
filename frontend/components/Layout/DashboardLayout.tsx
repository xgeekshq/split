import React from "react";
import { useSetRecoilState } from "recoil";
import PlusIcon from "../icons/PlusIcon";
import { styled } from "../../stitches.config";
import Button from "../Primitives/Button";
import Flex from "../Primitives/Flex";
import Text from "../Primitives/Text";
import { createBoardState } from "../../store/createBoard/atoms/create-board.atom";
import CalendarBar from "../Dashboard/Calendar/Calendar";

const AddNewBoardButton = styled(Button, {
  width: "fit-content",
  display: "flex",
  position: "relative",
  height: "$48",
  fontWeight: "$medium !important",
  lineHeight: "$20 !important",
});

const Main = styled("main", Flex, { width: "100%", height: "100%", ml: "48px" });

type DashboardLayoutProps = {
  children: React.ReactNode;
  firstName: string;
  isDashboard: boolean;
  isBoards: boolean;
};

const DashboardLayout = (props: DashboardLayoutProps) => {
  const { children, firstName, isDashboard, isBoards } = props;
  const setShowCreateBoard = useSetRecoilState(createBoardState);

  const handleOnClickNewBoard = () => {
    setShowCreateBoard(true);
  };

  return (
    <Main justify="between" gap="36" css={{ mr: isBoards ? "$56" : "0" }}>
      <Flex direction="column" css={{ mt: "$64", flexGrow: 1 }}>
        <Flex justify="between">
          {isDashboard && <Text heading="1">Welcome, {firstName}</Text>}
          {isBoards && <Text heading="1">Boards</Text>}
          <AddNewBoardButton onClick={handleOnClickNewBoard} size={isDashboard ? "sm" : "md"}>
            <PlusIcon css={{ color: "white", mr: "$8" }} />
            Add new board
          </AddNewBoardButton>
        </Flex>
        {children}
      </Flex>
      {isDashboard && <CalendarBar />}
    </Main>
  );
};

export default DashboardLayout;
