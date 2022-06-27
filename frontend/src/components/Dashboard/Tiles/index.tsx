import Icon from 'components/icons/Icon';
import Text from 'components/Primitives/Text';
import { HeaderInfo } from 'types/dashboard/header.info';
import { GridContainer, StyledTile } from './styles';

type TilesProps = {
	data: HeaderInfo;
};

const DashboardTiles = ({ data }: TilesProps) => {
	return (
		<GridContainer>
			<StyledTile>
				<Text size="md" color="white">
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
						height: '$100'
					}}
				/>
			</StyledTile>
			<StyledTile>
				<Text size="md" color="white">
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
						height: '$90'
					}}
				/>
			</StyledTile>
			<StyledTile>
				<Text size="md" color="white">
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
						height: '76px'
					}}
				/>
			</StyledTile>
		</GridContainer>
	);
};

export default DashboardTiles;
