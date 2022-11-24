import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRecoilValue } from 'recoil';
import { Popover, PopoverTrigger } from '@radix-ui/react-popover';

import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import CardAvatars from '@/components/CardBoard/CardAvatars';
import Icon from '@/components/icons/Icon';
import LogoIcon from '@/components/icons/Logo';
import Flex from '@/components/Primitives/Flex';
import Separator from '@/components/Primitives/Separator';
import Text from '@/components/Primitives/Text';
import Tooltip from '@/components/Primitives/Tooltip';
import { boardInfoState } from 'store/board/atoms/board.atom';
import BoardType from '@/types/board/board';
import { BoardUser, BoardUserNoPopulated } from '@/types/board/board.user';
import { BreadcrumbType } from '@/types/board/Breadcrumb';
import { TeamUser } from '@/types/team/team.user';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import isEmpty from '@/utils/isEmpty';
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

  if (isSubBoard && !!boardData?.mainBoardData) {
    const { title: mainTitle, id: mainId } = boardData.mainBoardData;

    breadcrumbItems.push(
      {
        title: mainTitle,
        link: `/boards/${mainId}`,
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
  return (
    <StyledHeader>
      <Flex align="center" gap="20" justify="between">
        <Flex direction="column">
          <Flex align="center" gap={!isSubBoard ? 26 : undefined}>
            <Breadcrumb items={breadcrumbItems} />

            {!isSubBoard && !!getSubBoard() && (
              <Flex align="center" gap={10}>
                <Separator css={{ height: '$14 !important' }} data-orientation="vertical" />
                <Link
                  href={{
                    pathname: `[boardId]`,
                    query: {
                      boardId: getSubBoard()?.id,
                      mainBoardId: boardData?.board._id,
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
        <Flex align="center" gap="24">
          <Flex align="center" gap="10">
            <Text
              color="primary800"
              size="sm"
              css={{
                fontWeight: 500,
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              {isSubBoard ? `Sub-team ${boardNumber}` : team.name}
            </Text>
            <CardAvatars
              isBoardsPage
              listUsers={isSubBoard ? users : teamUsers}
              responsible={false}
              teamAdmins={false}
              userId={session!.user.id}
            />
          </Flex>
          {!isEmpty(teamUsers.filter((user: TeamUser) => user.role === TeamUserRoles.ADMIN)) &&
            !isSubBoard && (
              <>
                <Separator css={{ height: '$24 !important' }} data-orientation="vertical" />

                <Flex align="center" gap="10">
                  <Text color="primary300" size="sm">
                    Team admins
                  </Text>
                  <CardAvatars
                    isBoardsPage
                    teamAdmins
                    listUsers={isSubBoard ? users : teamUsers}
                    responsible={false}
                    userId={session!.user.id}
                  />
                </Flex>
              </>
            )}
          {!isEmpty(
            (boardData!.board.users || users).filter(
              (user: BoardUser) => user.role === BoardUserRoles.STAKEHOLDER,
            ),
          ) && (
            <>
              <Separator css={{ height: '$24 !important' }} data-orientation="vertical" />

              <Flex align="center" gap="10">
                <Text color="primary300" size="sm">
                  Stakeholders
                </Text>
                <CardAvatars
                  isBoardsPage
                  stakeholders
                  listUsers={isSubBoard ? users : teamUsers}
                  responsible={false}
                  teamAdmins={false}
                  userId={session!.user.id}
                />
              </Flex>
            </>
          )}
          {isSubBoard && (
            <>
              <Separator css={{ height: '$24 !important' }} data-orientation="vertical" />

              <Flex align="center" gap="10">
                <Text color="primary300" size="sm">
                  Responsible
                </Text>
                <CardAvatars
                  isBoardsPage
                  responsible
                  listUsers={users}
                  teamAdmins={false}
                  userId={session!.user.id}
                />
              </Flex>
            </>
          )}
        </Flex>
      </Flex>

      {!isSubBoard && (
        <Popover>
          <PopoverTrigger asChild>
            <BoardCounter>
              <Icon name="info" />
              {
                dividedBoards.filter((dividedBoard: BoardType) => dividedBoard.submitedAt).length
              } of {dividedBoards.length} sub-team boards merged
            </BoardCounter>
          </PopoverTrigger>
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
        </Popover>
      )}
    </StyledHeader>
  );
};

export default BoardHeader;
