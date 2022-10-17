import React, { useMemo } from 'react';
import { styled } from 'styles/stitches/stitches.config';
import Icon from 'components/icons/Icon';
import Box from 'components/Primitives/Box';
import Flex from 'components/Primitives/Flex';
import Text from 'components/Primitives/Text';
import { Team } from 'types/team/team';
import CardTitle from './CardTitle';
import CardAvatars from 'components/CardBoard/CardAvatars';
import Separator from 'components/Primitives/Separator';
import CardEnd from './CardEnd';
import { useSession } from 'next-auth/react';
import BoardsInfo from './BoardsInfo';

const InnerContainer = styled(Flex, Box, {
	px: '$32',
	backgroundColor: '$white',
	borderRadius: '$12'
});

type CardBodyProps = {
	userId: string;
	team: Team;
	index?: number;
};

const CardBody = React.memo<CardBodyProps>(({ userId, team, index }) => {
	const { data: session } = useSession();

	const isSAdmin = session?.isSAdmin;

	const { _id: id, name, users } = team;

	const userIsParticipating = useMemo(() => {
		return !!users.find((user) => user.user._id === userId);
	}, [users, userId]);

	const havePermissions = useMemo(() => {
		if (isSAdmin) {
			return true;
		}

		const myUser = team.users.find((user) => String(user.user._id) === String(userId));

		if (team && (myUser?.role === 'admin' || myUser?.role === 'stakeholder')) {
			return true;
		}
		return false;
	}, [isSAdmin, team, userId, users]);

	return (
		<Flex css={{ flex: '1 1 0' }} direction="column" gap="12">
			<Flex>
				<InnerContainer
					align="center"
					elevation="1"
					justify="between"
					css={{
						position: 'relative',
						flex: '1 1 0',
						py: '$22',
						maxHeight: '$76',
						ml: 0
					}}
				>
					<Flex align="center">
						<Flex align="center" gap="8">
							<Icon
								name="blob-team"
								css={{
									width: '32px',
									height: '$32',
									zIndex: 1
								}}
							/>

							<Flex align="center" gap="8">
								<CardTitle teamId={id} title={team.name} />
							</Flex>
						</Flex>
					</Flex>

					<Flex align="center" gap="8">
						<Text color="primary300" size="sm">
							Members
						</Text>

						<CardAvatars
							listUsers={team.users}
							responsible={false}
							teamAdmins={false}
							userId={userId}
						/>

						<Separator
							orientation="vertical"
							css={{
								ml: '$40',
								backgroundColor: '$primary100',
								height: '$24 !important'
							}}
						/>

						<Flex css={{ ml: '$40', display: 'flex', alignItems: 'center' }}>
							<Text color="primary300" size="sm">
								Team admin
							</Text>

							<CardAvatars
								listUsers={team.users}
								responsible={false}
								teamAdmins={true}
								userId={userId}
							/>
							<Separator
								orientation="vertical"
								css={{
									ml: '$40',
									backgroundColor: '$primary100',
									height: '$24 !important'
								}}
							/>
						</Flex>
						<BoardsInfo userSAdmin={isSAdmin} teamAdmin={havePermissions} />
					</Flex>
					<CardEnd
						team={team}
						havePermissions={havePermissions}
						index={index}
						userId={userId}
						userIsParticipating={userIsParticipating}
						userSAdmin={isSAdmin}
					/>
				</InnerContainer>
			</Flex>
		</Flex>
	);
});

export default CardBody;
