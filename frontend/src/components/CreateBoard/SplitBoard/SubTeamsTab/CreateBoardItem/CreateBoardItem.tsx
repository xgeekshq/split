import { deepClone } from 'fast-json-patch';
import React from 'react';
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
import { StyledBoardItem, WandButtonWrapper } from './styles';

interface CreateBoardItemProps {
  index: number;
  board: BoardToAdd;
  setBoard: SetterOrUpdater<CreateBoardData>;
}

const CreateBoardItem: React.FC<CreateBoardItemProps> = ({ board, index, setBoard }) => {
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
    <Flex>
      <LeftArrow index={index} isDashboard={false} />
      <StyledBoardItem align="center" elevation="1" justify="between">
        <Flex css={{ flex: 1 }}>
          <Text heading="5">{board.title}</Text>
        </Flex>
        <Flex align="center" css={{ flex: 3 }}>
          <Flex align="center" gap={8}>
            <Text>Responsible Lottery</Text>
            <Separator orientation="vertical" size="md" />
            <WandButtonWrapper
              align="center"
              justify="center"
              disabled={users.length <= 1}
              {...(users.length > 1 && { onClick: handleLottery })}
            >
              <Icon name="wand" size={12} />
            </WandButtonWrapper>
            <Flex>
              <Text
                color="primary300"
                css={{
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
                size="sm"
              >
                {responsible?.firstName} {responsible?.lastName}
              </Text>
            </Flex>
            <Avatar
              css={{ position: 'relative' }}
              fallbackText={getInitials(
                responsible?.firstName ?? '-',
                responsible?.lastName ?? '-',
              )}
              size={32}
              colors={{
                bg: highlight2Colors.highlight2Lighter,
                fontColor: highlight2Colors.highlight2Dark,
              }}
            />
          </Flex>
        </Flex>
        <Flex align="center" justify="end" gap="8" css={{ flex: 2 }}>
          <Text size="sm">Sub team {index + 1}</Text>
          <AvatarGroup listUsers={board.users} userId="1" hasDrawer />
        </Flex>
      </StyledBoardItem>
    </Flex>
  );
};

export default CreateBoardItem;
