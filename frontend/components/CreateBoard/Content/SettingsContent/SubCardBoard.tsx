import { SetterOrUpdater } from "recoil";
import React from "react";
import { deepClone } from "fast-json-patch";
import { BoardToAdd } from "../../../../types/board/board";
import { BoardUserRoles } from "../../../../utils/enums/board.user.roles";
import CardAvatars from "../../../CardBoard/CardAvatars";
import LeftArrow from "../../../CardBoard/CardBody/LeftArrow";
import WandIcon from "../../../icons/Wand";
import Flex from "../../../Primitives/Flex";
import Separator from "../../../Primitives/Separator";
import Text from "../../../Primitives/Text";
import Box from "../../../Primitives/Box";
import { styled } from "../../../../stitches.config";
import Avatar from "../../../Primitives/Avatar";
import highlight2Colors from "../../../../styles/colors/highlight2.colors";
import { BoardUserToAdd } from "../../../../types/board/board.user";
import { CreateBoardData } from "../../../../store/createBoard/atoms/create-board.atom";

interface SubCardBoardProps {
  index: number;
  board: BoardToAdd;
  setBoard: SetterOrUpdater<CreateBoardData>;
}

const Container = styled(Flex, Box, {});

const SubCardBoard: React.FC<SubCardBoardProps> = ({ board, index, setBoard }) => {
  const { users } = board;
  const responsible = users.find((user) => user.role === BoardUserRoles.RESPONSIBLE)?.user;

  const handleLottery = () => {
    const cloneUsers = [...deepClone(users)].map((user) => ({
      ...user,
      role: BoardUserRoles.MEMBER,
    }));
    let userFound: BoardUserToAdd | undefined = undefined;

    while (userFound?.user.email === responsible?.email || !userFound) {
      userFound = cloneUsers[Math.floor(Math.random() * cloneUsers.length)];
    }
    if (userFound) {
      userFound.role = BoardUserRoles.RESPONSIBLE;

      setBoard((prevBoard) => ({
        ...prevBoard,
        board: {
          ...prevBoard.board,
          dividedBoards: prevBoard.board.dividedBoards.map((boardFound, i) => {
            if (i === index) {
              return { ...boardFound, users: cloneUsers };
            }
            return boardFound;
          }),
        },
      }));
    }
  };

  return (
    <Flex css={{ flex: "1 1 0", width: "100%" }}>
      <LeftArrow isDashboard={false} index={index} />

      <Container
        elevation="1"
        align="center"
        justify="between"
        css={{
          backgroundColor: "white",
          height: "$64",
          width: "100%",
          ml: "$40",
          py: "$16",
          pl: "$32",
          pr: "$24",
        }}
      >
        <Flex align="center">
          <Text heading="5">{board.title}</Text>
          <Flex align="center">
            <Text css={{ ml: "$40", mr: "$8" }}>Responsible Lottery</Text>
            <Separator
              orientation="vertical"
              css={{ "&[data-orientation=vertical]": { height: "$12", width: 1 } }}
            />
            <Flex
              css={{
                borderRadius: "$round",
                p: "4px",
                border: "1px solid $colors$primary400",
                ml: "$12",
                "@hover": {
                  "&:hover": {
                    cursor: "pointer",
                  },
                },
              }}
              onClick={handleLottery}
            >
              <WandIcon />
            </Flex>
            <Text size="sm" color="primary300" css={{ mx: "$8" }}>
              {responsible?.firstName} {responsible?.lastName}
            </Text>
            <Avatar
              css={{ position: "relative" }}
              size={32}
              colors={{
                bg: highlight2Colors.highlight2Lighter,
                fontColor: highlight2Colors.highlight2Dark,
              }}
              fallbackText={`${responsible?.firstName[0]}${responsible?.lastName[0]}`}
            />
          </Flex>
        </Flex>
        <Flex align="center" gap="8">
          <Text size="sm">Sub team {index + 1}</Text>
          <CardAvatars listUsers={board.users} responsible={false} teamAdmins={false} userId="1" />
        </Flex>
      </Container>
    </Flex>
  );
};

export default SubCardBoard;
