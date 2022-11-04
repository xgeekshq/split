import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import Icon from 'components/icons/Icon';
import { Popover, PopoverContent, PopoverItem } from 'components/Primitives/Popover';
import Text from 'components/Primitives/Text';
import { membersListState } from '../../../../store/team/atom/team.atom';
import { TeamUserRoles } from '../../../../utils/enums/team.user.roles';
import { PopoverTriggerStyled } from './styles';

interface PopoverRolesSettingsContentProps {
	userId: string;
}

const PopoverRolesSettingsContent: React.FC<PopoverRolesSettingsContentProps> = ({ userId }) => {
	const listMembers = useRecoilValue(membersListState);
	const setListMembers = useSetRecoilState(membersListState);

	const selectStakeholder = () => {
		const members = listMembers.map((member) => {
			if (member.user._id === userId) {
				return { ...member, role: TeamUserRoles.STAKEHOLDER };
			}
			return member;
		});

		setListMembers(members);
	};
	return (
		<PopoverContent portalled css={{ width: '$360', height: '$300' }}>
			<PopoverItem align="end" css={{ px: '$16' }} direction="column" gap="8">
				<Text css={{ fontWeight: 500, textAlign: 'end' }} size="sm">
					Team Member
				</Text>

				<Text css={{ fontWeight: 400, textAlign: 'end' }} size="sm">
					The team member can create boards and can create teams.
				</Text>
			</PopoverItem>

			<PopoverItem align="end" css={{ px: '$16' }} direction="column" gap="8">
				<Text css={{ fontWeight: 500, textAlign: 'end' }} size="sm">
					Team Admin
				</Text>
				<Text css={{ fontWeight: 400, textAlign: 'end' }} size="sm">
					The team admin can nominate team admins / stakeholder and can create/delete/edit
					team boards.
				</Text>
			</PopoverItem>

			<PopoverItem
				align="end"
				css={{ px: '$16' }}
				direction="column"
				gap="8"
				onClick={selectStakeholder}
			>
				<Text css={{ fontWeight: 500, textAlign: 'end' }} size="sm">
					Stakeholder
				</Text>
				<Text css={{ fontWeight: 400, textAlign: 'end' }} size="sm">
					Stakeholders will not be included in sub-team SPLIT retrospectives.
				</Text>
			</PopoverItem>
		</PopoverContent>
	);
};

interface PopoverRoleSettingsProps {
	isTeamCreator?: boolean;
	userId: string;
}

const PopoverRoleSettings: React.FC<PopoverRoleSettingsProps> = React.memo(
	({ isTeamCreator, userId }) => {
		return (
			<Popover>
				<PopoverTriggerStyled
					css={{
						position: 'relative'
					}}
				>
					{!isTeamCreator && (
						<Icon
							name="arrow-down"
							css={{
								width: '$20',
								height: '$20'
							}}
						/>
					)}
				</PopoverTriggerStyled>

				<PopoverRolesSettingsContent userId={userId} />
			</Popover>
		);
	}
);

export default PopoverRoleSettings;
