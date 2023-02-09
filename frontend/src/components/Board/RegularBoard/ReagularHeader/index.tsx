import { useSession } from 'next-auth/react';
import { useRecoilValue } from 'recoil';

import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
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
import Link from 'next/link';
import { StyledBoardTitle } from '@/components/CardBoard/CardBody/CardTitle/partials/Title/styles';
import AvatarGroup from '@/components/Primitives/Avatar/AvatarGroup';
import {
  MergeIconContainer,
  RecurrentIconContainer,
  StyledHeader,
  StyledLogo,
  TitleSection,
} from '../../SplitBoard/Header/styles';

interface Props {
  isParticipantsPage?: boolean;
}

const RegularBoardHeader = ({ isParticipantsPage }: Props) => {
  const { data: session } = useSession({ required: true });

  // Atoms
  const boardData = useRecoilValue(boardInfoState);

  // Get Board Info
  const { title, recurrent, users, team, isSubBoard, submitedAt, _id } = boardData.board;

  // Get Team users
  const teamUsers = team?.users ? team.users : [];

  const isRegularBoardWithNoTeam = !team;

  // Set breadcrumbs
  const breadcrumbItems: BreadcrumbType = isParticipantsPage
    ? [
        {
          title: 'Boards',
          link: '/boards',
        },
        {
          title,
          link: `/boards/${_id}`,
        },
        {
          title: 'Participants',
          isActive: true,
        },
      ]
    : [
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
          {!isEmpty(teamUsers) && (
            <Link href={`/teams/${team.id}`}>
              <Flex>
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
                      {team?.name}
                    </Text>
                  </StyledBoardTitle>
                  <AvatarGroup
                    isBoardsPage
                    listUsers={isSubBoard ? users : teamUsers}
                    responsible={false}
                    teamAdmins={false}
                    userId={session!.user.id}
                  />
                </Flex>
                {!isEmpty(
                  teamUsers.filter((user: TeamUser) => user.role === TeamUserRoles.ADMIN),
                ) && (
                  <>
                    <Separator orientation="vertical" size="lg" />

                    <Flex align="center" css={{ width: '100%' }} gap="10">
                      <Text color="primary300" size="sm">
                        Team admins
                      </Text>
                      <AvatarGroup
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
                    <Separator orientation="vertical" size="lg" />

                    <Flex align="center" gap="10">
                      <Text color="primary300" size="sm">
                        Stakeholders
                      </Text>
                      <AvatarGroup
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
              </Flex>
            </Link>
          )}

          {isRegularBoardWithNoTeam && (
            <Flex gap="24">
              <Flex align="center" gap="10">
                {isParticipantsPage ? (
                  <Text size="sm">Participants</Text>
                ) : (
                  <Link href={`/boards/${_id}/participants`}>
                    <StyledBoardTitle>
                      <Text size="sm">Participants</Text>
                    </StyledBoardTitle>
                  </Link>
                )}
                <AvatarGroup
                  isBoardsPage
                  responsible={false}
                  listUsers={users}
                  teamAdmins={false}
                  userId={session!.user.id}
                />
              </Flex>
              <Flex align="center">
                <Separator orientation="vertical" size="lg" />
              </Flex>
              <Flex align="center" gap="10">
                <Text color="primary300" size="sm">
                  Board Creator
                </Text>
                <AvatarGroup
                  isBoardsPage
                  responsible
                  listUsers={users}
                  teamAdmins={false}
                  userId={session!.user.id}
                />
              </Flex>
            </Flex>
          )}
        </Flex>
      </Flex>
    </StyledHeader>
  );
};

export default RegularBoardHeader;
