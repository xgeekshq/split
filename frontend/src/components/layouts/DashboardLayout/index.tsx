import { ReactNode } from 'react';
import Link from 'next/link';

import Icon from 'components/icons/Icon';
import Flex from 'components/Primitives/Flex';
import Text from 'components/Primitives/Text';
import { AddNewBoardButton, ContentSection } from './styles';

type DashboardLayoutProps = {
	children: ReactNode;
	firstName: string;
	isDashboard: boolean;
	isBoards: boolean;
	isTeams: boolean;
	canAddBoard: boolean;
};

const DashboardLayout = (props: DashboardLayoutProps) => {
	const { children, firstName, isDashboard, isBoards, isTeams, canAddBoard } = props;

	return (
		<ContentSection gap="36" justify="between">
			<Flex css={{ width: '100%' }} direction="column" gap="40">
				<Flex justify="between">
					{isDashboard && <Text heading="1">Welcome, {firstName}</Text>}
					{isBoards && <Text heading="1">Boards</Text>}
					{isTeams && <Text heading="1">Teams</Text>}
					{(isDashboard || isBoards) && (
						<Link href="/boards/new">
							<AddNewBoardButton size={isDashboard ? 'sm' : 'md'}  >
								<Icon css={{ color: 'white' }} name="plus" />
								Add new board
							</AddNewBoardButton>
						</Link>
					)}
					{isTeams && (
						<Link href="/">
							<AddNewBoardButton size={isDashboard ? 'sm' : 'md'} disabled={!canAddBoard}>
								<Icon css={{ color: 'white' }} name="plus" />
								Create new team
							</AddNewBoardButton>
						</Link>
					)}
				</Flex>
				{children}
			</Flex>
			{/* {isDashboard && <CalendarBar />} */}
		</ContentSection>
	);
};

export default DashboardLayout;
