import React, { useMemo } from 'react';

import Flex from 'components/Primitives/Flex';
import Separator from 'components/Primitives/Separator';
import Text from 'components/Primitives/Text';
import BoardType from 'types/board/board';
import CardAvatars from 'components/CardBoard/CardAvatars';

import { Team } from 'types/team/team';
import DeleteTeam from './DeleteTeam';

type CardEndProps = {
	team: Team;
	index: number | undefined;
	havePermissions: boolean;
	userId: string;
	userSAdmin?: boolean;
	userIsParticipating: boolean;
};

const CardEnd: React.FC<CardEndProps> = React.memo(
	({ team, index, havePermissions, userId, userSAdmin = undefined }) => {
		CardEnd.defaultProps = {
			userSAdmin: undefined
		};
		const { _id: id, users, name } = team;

		if (!userSAdmin) {
			return <Flex></Flex>;
		}

		if (!userSAdmin) {
			return (
				<Flex css={{ alignItems: 'center' }}>
					{(havePermissions || userSAdmin) && (
						<Flex align="center" css={{ ml: '$24' }} gap="24">
							<Separator
								orientation="vertical"
								css={{
									ml: '$8',
									backgroundColor: '$primary100',
									height: '$24 !important'
								}}
							/>

							<DeleteTeam teamId={id} teamName={name} />
						</Flex>
					)}
				</Flex>
			);
		}
		return null;
	}
);

export default CardEnd;
