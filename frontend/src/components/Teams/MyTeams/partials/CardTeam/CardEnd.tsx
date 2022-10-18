import React from 'react';

import Flex from 'components/Primitives/Flex';
import Separator from 'components/Primitives/Separator';
import { Team } from 'types/team/team';
import DeleteTeam from './DeleteTeam';

type CardEndProps = {
	team: Team;
	havePermissions: boolean;
	userId: string;
	userSAdmin?: boolean;
	userIsParticipating: boolean;
};

const CardEnd: React.FC<CardEndProps> = React.memo(
	({ team, havePermissions, userSAdmin = undefined }) => {
		CardEnd.defaultProps = {
			userSAdmin: undefined
		};
		const { _id: id, name } = team;

		if (userSAdmin || havePermissions) {
			return (
				<Flex css={{ alignItems: 'center' }}>
					<Flex align="center" css={{ ml: '$24' }} gap="24">
						<DeleteTeam teamId={id} teamName={name} />
					</Flex>
				</Flex>
			);
		}

		return <Flex></Flex>;
	}
);

export default CardEnd;
