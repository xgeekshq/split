import Link from 'next/link';
import { ReactNode } from 'react';

import Icon from '../../icons/Icon';
import Flex from '../../Primitives/Flex';
import Text from '../../Primitives/Text';
import { AddNewBoardButton, ContentSection } from './styles';

type DashboardLayoutProps = {
	children: ReactNode;
	firstName: string;
	isDashboard: boolean;
	isBoards: boolean;
};

const DashboardLayout = (props: DashboardLayoutProps) => {
	const { children, firstName, isDashboard, isBoards } = props;

	return (
		<ContentSection justify="between" gap="36">
			<Flex direction="column" gap="40" css={{ width: '100%' }}>
				<Flex justify="between">
					{isDashboard && <Text heading="1">Welcome, {firstName}</Text>}
					{isBoards && <Text heading="1">Boards</Text>}
					<Link href="/boards/new">
						<AddNewBoardButton size={isDashboard ? 'sm' : 'md'}>
							<Icon name="plus" css={{ color: 'white' }} />
							Add new board
						</AddNewBoardButton>
					</Link>
				</Flex>
				{children}
			</Flex>
			{/* {isDashboard && <CalendarBar />} */}
		</ContentSection>
	);
};

export default DashboardLayout;
