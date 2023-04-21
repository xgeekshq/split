import React from 'react';
import { deepClone } from 'fast-json-patch';
import { SetterOrUpdater } from 'recoil';

import LeftArrow from '@/components/CardBoard/CardBody/LeftArrow';
import Avatar from '@/components/Primitives/Avatars/Avatar/Avatar';
import AvatarGroup from '@/components/Primitives/Avatars/AvatarGroup/AvatarGroup';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Separator from '@/components/Primitives/Separator/Separator';
import Text from '@/components/Primitives/Text/Text';
import { CreateBoardData } from '@/store/createBoard/atoms/create-board.atom';
import { highlight2Colors } from '@/styles/stitches/partials/colors/highlight2.colors';
import { BoardToAdd } from '@/types/board/board';
import { BoardUserToAdd } from '@/types/board/board.user';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';
import { getInitials } from '@/utils/getInitials';
import Button from '@components/Primitives/Inputs/Button/Button';
import { InnerContainer } from '@styles/pages/pages.styles';

interface CreateSubBoardItemProps {
  index: number;
  board: BoardToAdd;
  setBoard: SetterOrUpdater<CreateBoardData>;
}

const CreateSubBoardItem = ({ board, index, setBoard }: CreateSubBoardItemProps) => {
  const { users } = board;
  const responsible = users.find((user) => user.role === BoardUserRoles.RESPONSIBLE)?.user;

  const handleLottery = () => {
    const cloneUsers = [...deepClone(users)].flatMap((user) => {
      if (!user.isNewJoiner && user.canBeResponsible)
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
    <Flex direction="column">
      <LeftArrow index={index} isDashboard={false} />
      <InnerContainer align="center" css={{ ml: '$40' }} elevation="1" justify="between" size="sm">
        <Flex css={{ flex: 2 }}>
          <Text heading="5">{board.title}</Text>
        </Flex>
        <Flex align="center" css={{ flex: 4 }}>
          <Flex align="center" gap={8}>
            <Text>Responsible Lottery</Text>
            <Separator orientation="vertical" size="md" />
            <Button
              css={{ borderRadius: '$round', borderWidth: '1px', px: '$6' }}
              disabled={users.length <= 1}
              size="xs"
              variant="lightOutline"
              onClick={(e) => {
                e.preventDefault();

                if (users.length > 1) {
                  handleLottery();
                }
              }}
            >
              <Icon name="wand" size={12} />
            </Button>
            <Flex>
              <Text
                color="primary300"
                size="sm"
                css={{
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
              >
                {responsible?.firstName} {responsible?.lastName}
              </Text>
            </Flex>
            <Avatar
              css={{ position: 'relative' }}
              size={32}
              colors={{
                bg: highlight2Colors.highlight2Lighter,
                fontColor: highlight2Colors.highlight2Dark,
              }}
              fallbackText={getInitials(
                responsible?.firstName ?? '-',
                responsible?.lastName ?? '-',
              )}
            />
          </Flex>
        </Flex>
        <Flex align="center" css={{ flex: 2 }} gap={8} justify="end">
          <Text size="sm">Sub team {index + 1}</Text>
          <AvatarGroup hasDrawer listUsers={board.users} userId="1" />
        </Flex>
      </InnerContainer>
    </Flex>
  );
};

export default CreateSubBoardItem;
