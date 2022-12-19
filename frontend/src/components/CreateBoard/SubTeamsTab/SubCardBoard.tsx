import React from 'react';
import { SetterOrUpdater } from 'recoil';
import { deepClone } from 'fast-json-patch';

import { highlight2Colors } from '@/styles/stitches/partials/colors/highlight2.colors';
import { styled } from '@/styles/stitches/stitches.config';

import CardAvatars from '@/components/CardBoard/CardAvatars';
import LeftArrow from '@/components/CardBoard/CardBody/LeftArrow';
import Icon from '@/components/icons/Icon';
import Avatar from '@/components/Primitives/Avatar';
import Box from '@/components/Primitives/Box';
import Flex from '@/components/Primitives/Flex';
import Separator from '@/components/Primitives/Separator';
import Text from '@/components/Primitives/Text';
import { CreateBoardData } from '@/store/createBoard/atoms/create-board.atom';
import { BoardToAdd } from '@/types/board/board';
import { BoardUserToAdd } from '@/types/board/board.user';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';

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
    const cloneUsers = [...deepClone(users)].flatMap((user) => {
      if (!user.isNewJoiner)
        return {
          ...user,
          role: BoardUserRoles.MEMBER,
        };
      return [];
    });

    if (cloneUsers.length <= 1) return;

    let userFound: BoardUserToAdd | undefined;
    do {
      userFound = cloneUsers[Math.floor(Math.random() * cloneUsers.length)];
    } while (userFound?.user.email === responsible?.email);

    if (!userFound) return;
    userFound.role = BoardUserRoles.RESPONSIBLE;

    const listUsers = users.map(
      (user) => cloneUsers.find((member) => member._id === user._id) || user,
    );

    setBoard((prevBoard) => ({
      ...prevBoard,
      board: {
        ...prevBoard.board,
        dividedBoards: prevBoard.board.dividedBoards.map((boardFound, i) => {
          if (i === index) {
            return { ...boardFound, users: listUsers };
          }
          return boardFound;
        }),
      },
    }));
  };

  return (
    <Flex css={{ flex: '1 1 0', width: '100%' }}>
      <LeftArrow index={index} isDashboard={false} />

      <Container
        align="center"
        elevation="1"
        justify="between"
        css={{
          backgroundColor: 'white',
          height: '$64',
          width: '100%',
          ml: '$40',
          py: '$16',
          pl: '$32',
          pr: '$24',
        }}
      >
        <Flex align="center" justify="start">
          <Text heading="5">{board.title}</Text>
        </Flex>

        <Flex align="center" justify="start">
          <Flex align="center">
            <Text css={{ mr: '$8' }}>Responsible Lottery</Text>
            <Separator
              css={{ '&[data-orientation=vertical]': { height: '$12', width: 1 } }}
              orientation="vertical"
            />
          </Flex>
          {users.length <= 1 ? (
            <Flex
              align="center"
              justify="center"
              css={{
                height: '$24',
                width: '$24',
                borderRadius: '$round',
                border: '1px solid $colors$primary400',
                ml: '$12',
                opacity: '0.2',
              }}
              onClick={handleLottery}
            >
              <Icon
                name="wand"
                css={{
                  width: '$12',
                  height: '$12',
                }}
              />
            </Flex>
          ) : (
            <Flex
              align="center"
              justify="center"
              css={{
                height: '$24',
                width: '$24',
                borderRadius: '$round',
                border: '1px solid $colors$primary400',
                ml: '$12',
                cursor: 'pointer',

                transition: 'all 0.2s ease-in-out',

                '&:hover': {
                  backgroundColor: '$primary400',
                  color: 'white',
                },
              }}
              onClick={handleLottery}
            >
              <Icon
                name="wand"
                css={{
                  width: '$12',
                  height: '$12',
                }}
              />
            </Flex>
          )}
          <Flex align="center">
            <Flex css={{ width: '100%' }}>
              <Text
                color="primary300"
                css={{
                  mx: '$8',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  width: '$100',
                }}
                size="sm"
              >
                {responsible?.firstName} {responsible?.lastName}
              </Text>
            </Flex>
            <Avatar
              css={{ position: 'relative' }}
              fallbackText={`${responsible?.firstName[0]}${responsible?.lastName[0]}`}
              size={32}
              colors={{
                bg: highlight2Colors.highlight2Lighter,
                fontColor: highlight2Colors.highlight2Dark,
              }}
            />
          </Flex>
        </Flex>

        <Flex align="center" gap="8" justify="center">
          <Text size="sm">Sub team {index + 1}</Text>
          <CardAvatars listUsers={board.users} responsible={false} teamAdmins={false} userId="1" />
        </Flex>
      </Container>
    </Flex>
  );
};

export default SubCardBoard;
