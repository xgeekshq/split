import { useSession } from 'next-auth/react';
import { useRecoilValue } from 'recoil';

import Breadcrumb from '@/components/Primitives/Breadcrumb';
import Icon from '@/components/Primitives/Icon';
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
import HeaderParticipants from './HeaderParticipants';
import { getGuestUserCookies } from '@/utils/getGuestUserCookies';

interface Props {
  isParticipantsPage?: boolean;
}

const RegularBoardHeader = ({ isParticipantsPage }: Props) => {
  const { data: session } = useSession({ required: false });

  // Atoms
  const boardData = useRecoilValue(boardInfoState);

  // Get Board Info
  const { title, recurrent, users, team, isSubBoard, submitedAt, _id } = boardData.board;

  // Get Team users
  const teamUsers = team?.users ? team.users : [];

  const isRegularBoardWithNoTeam = !team;

  // User id
  const userId = getGuestUserCookies() ? getGuestUserCookies().user : session?.user.id;

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
          <Flex>
            {isParticipantsPage ? (
              <HeaderParticipants isParticipantsPage />
            ) : (
              <Link href={`/boards/${_id}/participants`}>
                <Flex>
                  <HeaderParticipants />
                </Flex>
              </Link>
            )}
          </Flex>
        </Flex>
      </Flex>
    </StyledHeader>
  );
};

export default RegularBoardHeader;
