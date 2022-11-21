import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Popover } from '@radix-ui/react-popover';

import { PopoverContent } from 'components/Primitives/Popover';
import Text from 'components/Primitives/Text';
import { membersListState } from '../../../../store/team/atom/team.atom';
import { TeamUserRoles } from '../../../../utils/enums/team.user.roles';
import Icon from '../../../icons/Icon';
import { PopoverCloseStyled, PopoverItemStyled, PopoverTriggerStyled } from './styles';

interface PopoverRoleSettingsProps {
	userId: string;
}

const PopoverRoleSettings: React.FC<PopoverRoleSettingsProps> = React.memo(({ userId }) => {
	const listMembers = useRecoilValue(membersListState);
	const setListMembers = useSetRecoilState(membersListState);

	const selectRole = (value: TeamUserRoles) => {
		const members = listMembers.map((member) => {
			if (member.user._id === userId) {
				return { ...member, role: value };
			}
			return member;
		});

		setListMembers(members);
	};
	return (
		<Popover>
			<PopoverTriggerStyled
				css={{
					position: 'relative'
				}}
			>
				<Icon
					name="arrow-down"
					css={{
						width: '$20',
						height: '$20'
					}}
				/>
			</PopoverTriggerStyled>

			<PopoverContent portalled css={{ width: '$360', height: '$316' }}>
				<PopoverCloseStyled>
					<PopoverItemStyled
						align="end"
						direction="column"
						onClick={() => selectRole(TeamUserRoles.MEMBER)}
					>
						<Text css={{ textAlign: 'end' }} size="sm" weight="medium">
							Team Member
						</Text>

						<Text css={{ textAlign: 'end' }} size="sm">
							The team member can create boards and can create teams.
						</Text>
					</PopoverItemStyled>
				</PopoverCloseStyled>
				<PopoverCloseStyled>
					<PopoverItemStyled
						align="end"
						direction="column"
						onClick={() => selectRole(TeamUserRoles.ADMIN)}
					>
						<Text css={{ textAlign: 'end' }} size="sm" weight="medium">
							Team Admin
						</Text>
						<Text css={{ textAlign: 'end' }} size="sm">
							The team admin can nominate team admins / stakeholder and can
							create/delete/edit team boards.
						</Text>
					</PopoverItemStyled>
				</PopoverCloseStyled>
				<PopoverCloseStyled>
					<PopoverItemStyled
						align="end"
						direction="column"
						onClick={() => selectRole(TeamUserRoles.STAKEHOLDER)}
					>
						<Text css={{ textAlign: 'end' }} size="sm" weight="medium">
							Stakeholder
						</Text>
						<Text css={{ textAlign: 'end' }} size="sm">
							Stakeholders will not be included in sub-team SPLIT retrospectives.
						</Text>
					</PopoverItemStyled>
				</PopoverCloseStyled>
			</PopoverContent>
		</Popover>
	);
});

export default PopoverRoleSettings;
