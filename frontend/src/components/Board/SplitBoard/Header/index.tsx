import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRecoilValue } from 'recoil';
import { Popover, PopoverPortal, PopoverTrigger } from '@radix-ui/react-popover';

import Breadcrumb from '@/components/Primitives/Breadcrumb/Breadcrumb';
import Icon from '@/components/Primitives/Icon';
import LogoIcon from '@/components/icons/Logo';
import Flex from '@/components/Primitives/Layout/Flex';
import Separator from '@/components/Primitives/Separator';
import Text from '@/components/Primitives/Text';
import Tooltip from '@/components/Primitives/Tooltip/Tooltip';
import { boardInfoState } from '@/store/board/atoms/board.atom';
import BoardType from '@/types/board/board';
import { BoardUserNoPopulated } from '@/types/board/board.user';
import { BreadcrumbType } from '@/types/board/Breadcrumb';
import { TeamUser } from '@/types/team/team.user';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import isEmpty from '@/utils/isEmpty';
import { StyledBoardTitle } from '@/components/CardBoard/CardBody/CardTitle/partials/Title/styles';
import { ListBoardMembers } from '@/components/Boards/MyBoards/ListBoardMembers';
import { useMemo, useState } from 'react';
import { User } from '@/types/user/user';
import AvatarGroup from '@/components/Primitives/Avatars/AvatarGroup/AvatarGroup';
import { BoardPhases } from '@/utils/enums/board.phases';
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
} from './styles';

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
      <Flex align="center" gap="20" justify="between">
        <Flex direction="column">
          <Flex align="center" gap={!isSubBoard ? 26 : undefined}>
            <Breadcrumb items={breadcrumbItems} />

            {!isSubBoard && !!getSubBoard() && (
              <Flex align="center" gap={10}>
                <Separator css={{ height: '$14 !important' }} orientation="vertical" />
                <Link
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
                  size="sm"
                  fontWeight="medium"
                  css={{
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                  }}
                >
                  {`Sub-team ${boardNumber}`}
                </Text>
              </StyledBoardTitle>
              <AvatarGroup
                listUsers={users}
                responsible={false}
                teamAdmins={false}
                userId={session!.user.id}
                hasDrawer
              />
            </Flex>

            <Separator orientation="vertical" size="lg" />
            <Flex align="center" gap="10">
              <Text color="primary300" size="sm">
                Responsible
              </Text>
              <AvatarGroup
                responsible
                listUsers={users}
                teamAdmins={false}
                userId={session!.user.id}
                hasDrawer
              />
            </Flex>
            <ListBoardMembers
              boardMembers={boardMembers}
              isOpen={dialogIsOpen}
              setIsOpen={setDialogIsOpen}
              isSubBoard
            />
          </Flex>
        ) : (
          <Link href={`/teams/${team.id}`}>
            <Flex align="center" gap="24">
              <Flex align="center" gap="10">
                <StyledBoardTitle>
                  <Text
                    color="primary800"
                    size="sm"
                    fontWeight="medium"
                    css={{
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                    }}
                  >
                    {team.name}
                  </Text>
                </StyledBoardTitle>
                <AvatarGroup
                  listUsers={teamUsers}
                  responsible={false}
                  teamAdmins={false}
                  userId={session!.user.id}
                  isClickable
                />
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
                      teamAdmins
                      listUsers={teamUsers}
                      responsible={false}
                      userId={session!.user.id}
                      isClickable
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
                      stakeholders
                      listUsers={teamUsers}
                      responsible={false}
                      teamAdmins={false}
                      userId={session!.user.id}
                      isClickable
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
