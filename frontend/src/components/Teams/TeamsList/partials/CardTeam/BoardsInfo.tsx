import Icon from 'components/icons/Icon';
import Flex from 'components/Primitives/Flex';
import Text from 'components/Primitives/Text';
import { Team } from '../../../../../types/team/team';

type BoardsInfoProps = {
	userSAdmin: boolean | undefined;
	teamAdmin: boolean;
	team: Team;
};

const BoardsInfo = ({ userSAdmin, teamAdmin, team }: BoardsInfoProps) => {
	if (team.boardsCount === 0) {
		return (
			<Flex css={{ ml: '$20', display: 'flex', alignItems: 'center' }}>
				{(userSAdmin || teamAdmin) && (
					// <Link href="/boards/new">
					<Flex css={{ alignItems: 'center' }}>
						<Icon
							name="plus"
							css={{
								width: '$16',
								height: '$32',
								marginRight: '$5'
							}}
						/>
						<Text css={{ ml: '$8' }} size="sm" weight="medium">
							Create first team board
						</Text>
					</Flex>
					// </Link>
				)}
				{!teamAdmin && (
					<Text css={{ ml: '$14' }} size="sm" weight="medium">
						0 boards
					</Text>
				)}
			</Flex>
		);
	}

	return (
		<Flex css={{ ml: '$20', display: 'flex', alignItems: 'center' }}>
			{/* <Link href="boards/"> */}
			<Text css={{ ml: '$14' }} size="sm" weight="medium">
				{team.boardsCount} team boards
			</Text>
			{/* </Link> */}
		</Flex>
	);
};

export default BoardsInfo;
