import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Popover, PopoverPortal, PopoverTrigger } from '@radix-ui/react-popover';
import { useRecoilValue } from 'recoil';

import {
  BoardCounter,
  MergeIconContainer,
  RecurrentIconContainer,
  StyledBoardLink,
  StyledHeader,
  StyledLogo,
  StyledPopoverArrow,
  StyledPopoverContent,
  StyledPopoverItem,
  TitleSection,
} from '@/components/Board/SplitBoard/Header/styles';
import { ListBoardMembers } from '@/components/Boards/MyBoards/ListBoardMembers';
import { StyledBoardTitle } from '@/components/CardBoard/CardBody/CardTitle/partials/Title/styles';
import LogoIcon from '@/components/icons/Logo';
import AvatarGroup from '@/components/Primitives/Avatars/AvatarGroup/AvatarGroup';
import Breadcrumb from '@/components/Primitives/Breadcrumb/Breadcrumb';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Separator from '@/components/Primitives/Separator/Separator';
import Text from '@/components/Primitives/Text/Text';
import Tooltip from '@/components/Primitives/Tooltips/Tooltip/Tooltip';
import { boardInfoState } from '@/store/board/atoms/board.atom';
import BoardType from '@/types/board/board';
import { BoardUserNoPopulated } from '@/types/board/board.user';
import { BreadcrumbType } from '@/types/board/Breadcrumb';
import { TeamUser } from '@/types/team/team.user';
import { User } from '@/types/user/user';
import { BoardPhases } from '@/utils/enums/board.phases';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import isEmpty from '@/utils/isEmpty';

const BoardHeader = () => {
  const { data: session } = useSession({ required: true });
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  // Atoms
  const boardData = useRecoilValue(boardInfoState);

  // Get Board Info
  const { title, recurrent, users, team, dividedBoards, isSubBoard, submitedAt, boardNumber } =
    boardData.board;

  // Get Team users

  const teamUsers = team.users ? team.users : [];

  // Found sub-board
  const getSubBoard = (): { id: string; title: string } | undefined => {
    const boardInfo = dividedBoards.find((board: BoardType) =>
      board.users.find(
        (user) => (user as unknown as BoardUserNoPopulated).user === session?.user?.id,
      ),
    );

    if (boardInfo) {
      return {
        id: boardInfo._id,
        title: boardInfo.title,
      };
    }

    return undefined;
  };

  // Set breadcrumbs
  const breadcrumbItems: BreadcrumbType = [
    {
      title: 'Boards',
      link: '/boards',
    },
  ];

  if (isSubBoard && boardData.mainBoard) {
    const { _id: mainBoardId, title: mainBoardTitle } = boardData.mainBoard;
    breadcrumbItems.push(
      {
        title: mainBoardTitle ?? title,
        link: `/boards/${mainBoardId}`,
      },
      {
        title,
        isActive: true,
      },
    );
  } else {
    breadcrumbItems.push({
      title,
      isActive: true,
    });
  }

  const handleOpenDialog = () => {
    setDialogIsOpen(!dialogIsOpen);
  };

  const boardMembers = useMemo(
    () =>
      users.map((member) => ({
        ...member,
        user: member.user as User,
      })),
    [users],
  );

  return (
    <StyledHeader>
      <Flex align="center" css={{ width: '100%' }} gap="20" justify="between">
        <Flex direction="column">
          <Flex align="center" gap={!isSubBoard ? 26 : undefined}>
            <Breadcrumb items={breadcrumbItems} />

            {!isSubBoard && !!getSubBoard() && (
              <Flex align="center" gap={10}>
                <Separator css={{ height: '$14 !important' }} orientation="vertical" />
                <Link
                  legacyBehavior
                  passHref
                  href={{
                    pathname: `[boardId]`,
                    query: {
                      boardId: getSubBoard()?.id,
                      mainBoardId: boardData?.board._id,
                      mainBoardTitle: boardData?.board.title,
                    },
                  }}
                >
                  <StyledBoardLink>{getSubBoard()?.title.replace('team ', '')}</StyledBoardLink>
                </Link>
              </Flex>
            )}
          </Flex>
          <TitleSection>
            <StyledLogo>
              <LogoIcon />
            </StyledLogo>
            <Text heading="2">{title}</Text>

            {recurrent && (
              <Tooltip content="Occurs every month">
                <RecurrentIconContainer>
                  <Icon name="recurring" />
                </RecurrentIconContainer>
              </Tooltip>
            )}

            {isSubBoard && !submitedAt && (
              <Tooltip content="Unmerged">
                <MergeIconContainer isMerged={!!submitedAt}>
                  <Icon name="merge" />
                </MergeIconContainer>
              </Tooltip>
            )}
          </TitleSection>
        </Flex>
        {isSubBoard ? (
          <Flex align="center" gap="24">
            <Flex align="center" gap="10">
              <StyledBoardTitle onClick={handleOpenDialog}>
                <Text
                  color="primary800"
                  fontWeight="medium"
                  size="sm"
                  css={{
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                  }}
                >
                  {`Sub-team ${boardNumber}`}
                </Text>
              </StyledBoardTitle>
              <AvatarGroup hasDrawer listUsers={users} userId={session!.user.id} />
            </Flex>

            <Separator orientation="vertical" size="lg" />
            <Flex align="center" gap="10">
              <Text color="primary300" size="sm">
                Responsible
              </Text>
              <AvatarGroup hasDrawer responsible listUsers={users} userId={session!.user.id} />
            </Flex>
            <ListBoardMembers
              isSubBoard
              boardMembers={boardMembers}
              isOpen={dialogIsOpen}
              setIsOpen={setDialogIsOpen}
            />
          </Flex>
        ) : (
          <Link href={`/teams/${team.id}`}>
            <Flex align="center" gap="24">
              <Flex align="center" gap="10">
                <StyledBoardTitle>
                  <Text
                    color="primary800"
                    fontWeight="medium"
                    size="sm"
                    css={{
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                    }}
                  >
                    {team.name}
                  </Text>
                </StyledBoardTitle>
                <AvatarGroup isClickable listUsers={teamUsers} userId={session!.user.id} />
              </Flex>
              {!isEmpty(
                teamUsers.filter((user: TeamUser) => user.role === TeamUserRoles.ADMIN),
              ) && (
                <>
                  <Separator orientation="vertical" size="lg" />
                  <Flex align="center" gap="10">
                    <Text color="primary300" size="sm">
                      Team admins
                    </Text>
                    <AvatarGroup
                      isClickable
                      teamAdmins
                      listUsers={teamUsers}
                      userId={session!.user.id}
                    />
                  </Flex>
                </>
              )}
              {!isEmpty(
                boardData.board.team.users.filter(
                  (user: TeamUser) => user.role === TeamUserRoles.STAKEHOLDER,
                ),
              ) && (
                <>
                  <Separator orientation="vertical" size="lg" />
                  <Flex align="center" gap="10">
                    <Text color="primary300" size="sm">
                      Stakeholders
                    </Text>
                    <AvatarGroup
                      isClickable
                      stakeholders
                      listUsers={teamUsers}
                      userId={session!.user.id}
                    />
                  </Flex>
                </>
              )}
            </Flex>
          </Link>
        )}
      </Flex>

      {!isSubBoard && (
        <Popover>
          <PopoverTrigger asChild>
            <BoardCounter>
              <Icon name="info" />
              {boardData.board.phase === BoardPhases.ADDCARDS ||
              boardData.board.phase === undefined ? (
                <div>
                  {
                    dividedBoards.filter((dividedBoard: BoardType) => dividedBoard.submitedAt)
                      .length
                  }{' '}
                  of {dividedBoards.length} sub-team boards merged
                </div>
              ) : null}
              {boardData.board.phase === BoardPhases.VOTINGPHASE ? 'Voting Phase' : null}
              {boardData.board.phase === BoardPhases.SUBMITTED ? 'Submited' : null}
            </BoardCounter>
          </PopoverTrigger>
          <PopoverPortal>
            <StyledPopoverContent>
              <Flex direction="column">
                {dividedBoards.map((board: BoardType) => (
                  <StyledPopoverItem key={board.title.toLowerCase().split(' ').join('-')}>
                    <p>{board.title}</p>

                    <div>
                      {board.submitedAt ? 'Merged' : 'Unmerged'}
                      <MergeIconContainer isMerged={!!board.submitedAt}>
                        <Icon name="merge" />
                      </MergeIconContainer>{' '}
                    </div>
                  </StyledPopoverItem>
                ))}
              </Flex>

              <StyledPopoverArrow />
            </StyledPopoverContent>
          </PopoverPortal>
        </Popover>
      )}
    </StyledHeader>
  );
};

export default BoardHeader;
