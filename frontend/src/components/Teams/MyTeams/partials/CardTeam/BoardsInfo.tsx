import { getDashboardHeaderInfo } from 'api/authService';
import { StyledBoardTitle } from 'components/CardBoard/CardBody/CardTitle/partials/Title/styles';
import Icon from 'components/icons/Icon';
import Flex from 'components/Primitives/Flex';
import Link from 'next/link';
import { useQuery } from 'react-query';

type BoardsInfoProps = {
	userSAdmin: boolean | undefined;
};

const BoardsInfo = ({ userSAdmin }: BoardsInfoProps) => {
	const { data: boardInfo } = useQuery('dashboardInfo', () => getDashboardHeaderInfo(), {
		enabled: true,
		refetchOnWindowFocus: false
	});

	//need to add permission to user if he is the team admin

	if (!boardInfo?.boardsCount) {
		return (
			<Flex css={{ ml: '$40', display: 'flex', alignItems: 'center' }}>
				{userSAdmin && (
					<Link href="/boards/new">
						<a style={{ textDecoration: 'none' }}>
							<Flex css={{ alignItems: 'center' }}>
								<Icon
									css={{
										width: '16px',
										height: '$32',
										marginRight: '$10'
									}}
									name="plus"
								/>
								<StyledBoardTitle> Create first team board</StyledBoardTitle>
							</Flex>
						</a>
					</Link>
				)}
			</Flex>
		);
	}

	return (
		<Flex css={{ ml: '$40', display: 'flex', alignItems: 'center' }}>
			<Link href="boards/">
				<StyledBoardTitle>{boardInfo?.boardsCount} team boards</StyledBoardTitle>
			</Link>
		</Flex>
	);
};

export default BoardsInfo;
