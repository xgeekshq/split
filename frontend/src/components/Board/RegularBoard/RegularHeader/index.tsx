import { useRecoilValue } from 'recoil';

import Breadcrumb from '@/components/Primitives/Breadcrumb/Breadcrumb';
import Icon from '@/components/Primitives/Icons/Icon/Icon';
import LogoIcon from '@/components/icons/Logo';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import Tooltip from '@/components/Primitives/Tooltips/Tooltip/Tooltip';
import { boardInfoState } from '@/store/board/atoms/board.atom';
import { BreadcrumbType } from '@/types/board/Breadcrumb';
import Link from 'next/link';
import {
  MergeIconContainer,
  RecurrentIconContainer,
  StyledHeader,
  StyledLogo,
  TitleSection,
} from '../../SplitBoard/Header/styles';
import HeaderParticipants from './HeaderParticipants';

interface Props {
  isParticipantsPage?: boolean;
}

const RegularBoardHeader = ({ isParticipantsPage }: Props) => {
  // Atoms
  const boardData = useRecoilValue(boardInfoState);

  // Get Board Info
  const { title, recurrent, isSubBoard, submitedAt, _id } = boardData.board;

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
    <StyledHeader align="center" gap="20" justify="between">
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
    </StyledHeader>
  );
};

export default RegularBoardHeader;
