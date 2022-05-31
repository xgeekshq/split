import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';

import Icon from 'components/icons/Icon';
import Flex from 'components/Primitives/Flex';
import {
	ACCOUNT_ROUTE,
	BOARDS_ROUTE,
	DASHBOARD_ROUTE,
	SETTINGS_ROUTE,
	START_PAGE_ROUTE,
	TEAMS_ROUTE,
	USERS_ROUTE
} from 'utils/routes';
import { StyledMenuItem, StyledSeparator, StyledText } from './styles';

interface SidebarContentProps {
	strategy: string;
}

const SideBarContent: React.FC<SidebarContentProps> = ({ strategy }) => {
	const router = useRouter();
	const [active, setActive] = useState(router.asPath);
	const isStrategyLocal = strategy === 'local';

	const handleSignOut = async () => {
		const result = await signOut({
			callbackUrl: isStrategyLocal ? START_PAGE_ROUTE : '/logoutAzure',
			redirect: !isStrategyLocal
		});
		if (result && isStrategyLocal) {
			router.push(result.url);
		}
	};

	useEffect(() => {
		setActive(router.asPath);
	}, [router.asPath]);

	return (
		<Flex direction="column">
			<Link href={DASHBOARD_ROUTE}>
				<StyledMenuItem data-active={active === DASHBOARD_ROUTE} align="center">
					<Icon name="dashboard" />
					<StyledText>Dashboard</StyledText>
				</StyledMenuItem>
			</Link>
			<Link href={BOARDS_ROUTE}>
				<StyledMenuItem data-active={active === BOARDS_ROUTE} align="center">
					<Icon name="boards" />
					<StyledText>Boards</StyledText>
				</StyledMenuItem>
			</Link>
			<Link href={USERS_ROUTE}>
				<StyledMenuItem data-active={active === USERS_ROUTE} align="center">
					<Icon name="user" />
					<StyledText>Users</StyledText>
				</StyledMenuItem>
			</Link>
			<Link href={TEAMS_ROUTE}>
				<StyledMenuItem data-active={active === TEAMS_ROUTE} align="center">
					<Icon name="team" />
					<StyledText>Teams</StyledText>
				</StyledMenuItem>
			</Link>
			<StyledSeparator />
			<Link href={ACCOUNT_ROUTE}>
				<StyledMenuItem data-active={active === ACCOUNT_ROUTE} align="center">
					<Icon name="user-circle" />
					<StyledText>Account</StyledText>
				</StyledMenuItem>
			</Link>
			<Link href={SETTINGS_ROUTE}>
				<StyledMenuItem
					css={{ mb: '$16' }}
					data-active={active === SETTINGS_ROUTE}
					align="center"
				>
					<Icon name="settings" />
					<StyledText>Settings</StyledText>
				</StyledMenuItem>
			</Link>
			<StyledSeparator />
			<StyledMenuItem
				css={{ mt: '$16' }}
				data-active={active === TEAMS_ROUTE}
				align="center"
				onClick={handleSignOut}
			>
				<Icon name="log-out" />
				<StyledText>Log out</StyledText>
			</StyledMenuItem>
		</Flex>
	);
};

export default SideBarContent;
