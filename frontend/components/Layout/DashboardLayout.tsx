import Link from "next/link";
import React from "react";
import { styled } from "../../stitches.config";
import Button from "../Primitives/Button";
import Flex from "../Primitives/Flex";
import Text from "../Primitives/Text";
import Icon from "../icons/Icon";

const AddNewBoardButton = styled(Button, "a", {
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

  return (
    <Main justify="between" gap="36" css={{ mr: "$56" }}>
      <Flex direction="column" css={{ mt: "$64", flexGrow: 1 }}>
        <Flex justify="between">
          {isDashboard && <Text heading="1">Welcome, {firstName}</Text>}
          {isBoards && <Text heading="1">Boards</Text>}
          <Link href="/boards/new">
            <AddNewBoardButton size={isDashboard ? "sm" : "md"}>
              <Icon name="plus" css={{ color: "white" }} />
              Add new board
            </AddNewBoardButton>
          </Link>
        </Flex>
        {children}
      </Flex>
      {/* {isDashboard && <CalendarBar />} */}
    </Main>
  );
};

export default DashboardLayout;
