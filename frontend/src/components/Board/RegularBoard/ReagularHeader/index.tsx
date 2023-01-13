import { useSession } from 'next-auth/react';
import { useRecoilValue } from 'recoil';

import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import CardAvatars from '@/components/CardBoard/CardAvatars';
import Icon from '@/components/icons/Icon';
import LogoIcon from '@/components/icons/Logo';
import Flex from '@/components/Primitives/Flex';
import Separator from '@/components/Primitives/Separator';
import Text from '@/components/Primitives/Text';
import Tooltip from '@/components/Primitives/Tooltip';
import { boardInfoState } from '@/store/board/atoms/board.atom';
import { BreadcrumbType } from '@/types/board/Breadcrumb';
import { TeamUser } from '@/types/team/team.user';
import { TeamUserRoles } from '@/utils/enums/team.user.roles';
import isEmpty from '@/utils/isEmpty';
import {
  MergeIconContainer,
  RecurrentIconContainer,
  StyledHeader,
  StyledLogo,
  TitleSection,
} from '../../SplitBoard/Header/styles';

const RegularBoardHeader = () => {
  const { data: session } = useSession({ required: true });

  // Atoms
  const boardData = useRecoilValue(boardInfoState);

  // Get Board Info
  const { title, recurrent, users, team, isSubBoard, submitedAt } = boardData.board;

  // Get Team users
  const teamUsers = team?.users ? team.users : [];

  const isPersonalBoard = !team && users.length <= 1;

  const isRegularBoardWithNoTeam = !team && users.length > 1;

  // Set breadcrumbs
  const breadcrumbItems: BreadcrumbType = [
    {
      title: 'Boards',
      link: '/boards',
    },
    {
      title,
      isActive: true,
    },
  ];

  return (
    <StyledHeader>
      <Flex align="center" gap="20" justify="between">
        <Flex direction="column">
          <Flex align="center" gap={!isSubBoard ? 26 : undefined}>
            <Breadcrumb items={breadcrumbItems} />
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
              {team?.name}
            </Text>
            <CardAvatars
              isBoardsPage
              listUsers={isSubBoard ? users : teamUsers}
              responsible={false}
              teamAdmins={false}
              userId={session!.user.id}
            />
          </Flex>
          {!isEmpty(teamUsers.filter((user: TeamUser) => user.role === TeamUserRoles.ADMIN)) && (
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
            boardData.board.team?.users.filter(
              (user: TeamUser) => user.role === TeamUserRoles.STAKEHOLDER,
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
          {isRegularBoardWithNoTeam && (
            <>
              <Flex align="center" gap="10">
                <Text color="primary300" size="sm">
                  Participants
                </Text>
                <CardAvatars
                  isBoardsPage
                  responsible={false}
                  listUsers={users}
                  teamAdmins={false}
                  userId={session!.user.id}
                />
              </Flex>
              <Separator css={{ height: '$24 !important' }} data-orientation="vertical" />
              <Flex align="center" gap="10">
                <Text color="primary300" size="sm">
                  Board Creator
                </Text>
                <CardAvatars
                  isBoardsPage
                  responsible
                  listUsers={users}
                  teamAdmins={false}
                  userId={session!.user.id}
                  isRegularBoardNoTeam
                />
              </Flex>
            </>
          )}
          {isPersonalBoard && (
            <>
              <Flex align="center" gap="10">
                <Text color="primary300" size="sm">
                  Board Creator
                </Text>
                <CardAvatars
                  isBoardsPage
                  responsible
                  listUsers={users}
                  teamAdmins={false}
                  userId={session!.user.id}
                  isRegularBoardNoTeam
                />
              </Flex>
            </>
          )}
        </Flex>
      </Flex>
    </StyledHeader>
  );
};

export default RegularBoardHeader;
