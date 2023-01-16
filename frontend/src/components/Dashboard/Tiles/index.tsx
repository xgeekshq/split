import Icon from '@/components/icons/Icon';
import Text from '@/components/Primitives/Text';
import { HeaderInfo } from '@/types/dashboard/header.info';
import { BOARDS_ROUTE, TEAMS_ROUTE, USERS_ROUTE } from '@/utils/routes';
import Link from 'next/link';
import { GridContainer, StyledTile } from './styles';

type TilesProps = {
  data: HeaderInfo;
};

const DashboardTiles = ({ data }: TilesProps) => (
  <GridContainer>
    <Link href={`${BOARDS_ROUTE}`}>
      <StyledTile>
        <Text color="white" size="md">
          Your boards
        </Text>
        <h3>{data.boardsCount}</h3>

        <Icon
          name="blob-purple"
          css={{
            position: 'absolute',
            right: '-1px',
            top: '0',
            bottom: '-1px',
            width: '$100',
            height: '$100',
          }}
        />
        <Icon
          name="arrow-long-right"
          css={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            bottom: '-1px',
            width: '$24',
            height: '$24',
            color: '$black',
          }}
        />
      </StyledTile>
    </Link>
    <Link href={`${TEAMS_ROUTE}`}>
      <StyledTile>
        <Text color="white" size="md">
          Your teams
        </Text>
        <h3>{data?.teamsCount}</h3>

        <Icon
          name="blob-blue"
          css={{
            position: 'absolute',
            right: '-1px',
            top: '0px',
            width: '126px',
            height: '$90',
          }}
        />
        <Icon
          name="arrow-long-right"
          css={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            bottom: '-1px',
            width: '$24',
            height: '$24',
            color: '$black',
          }}
        />
      </StyledTile>
    </Link>
    <Link href={`${USERS_ROUTE}`}>
      <StyledTile>
        <Text color="white" size="md">
          Active Members
        </Text>
        <h3>{data?.usersCount}</h3>

        <Icon
          name="blob-yellow"
          css={{
            position: 'absolute',
            right: '-1px',
            bottom: '-1px',
            width: '127px',
            height: '76px',
          }}
        />
        <Icon
          name="arrow-long-right"
          css={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            bottom: '-1px',
            width: '$24',
            height: '$24',
            color: '$black',
          }}
        />
      </StyledTile>
    </Link>
  </GridContainer>
);

export default DashboardTiles;
