import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Popover } from '@radix-ui/react-popover';

import { PopoverContent } from 'components/Primitives/Popover';
import Text from 'components/Primitives/Text';
import useTeam from '../../../../hooks/useTeam';
import { membersListState } from '../../../../store/team/atom/team.atom';
import { TeamUserUpdate } from '../../../../types/team/team.user';
import { TeamUserRoles } from '../../../../utils/enums/team.user.roles';
import Icon from '../../../icons/Icon';
import { PopoverCloseStyled, PopoverItemStyled, PopoverTriggerStyled } from './styles';

interface PopoverRoleSettingsProps {
	userId: string;
	isTeamPage?: boolean;
}

const PopoverRoleSettings: React.FC<PopoverRoleSettingsProps> = React.memo(
	({ userId, isTeamPage }) => {
		const listMembers = useRecoilValue(membersListState);
		const setListMembers = useSetRecoilState(membersListState);

		const {
			updateTeamUser: { mutate }
		} = useTeam({ autoFetchTeam: false });

		const selectRole = (value: TeamUserRoles) => {
			const members = listMembers.map((member) => {
				if (member.user._id === userId) {
					return { ...member, role: value };
				}
				return member;
			});

			setListMembers(members);
		};

		const updateUserRole = (value: TeamUserRoles) => {
			const userFound = listMembers.find((member) => member.user._id === userId);

			if (userFound && userFound.team) {
				const updateTeamUser: TeamUserUpdate = {
					team: userFound.team,
					user: userId,
					role: value,
					isNewJoiner: userFound.isNewJoiner
				};

				mutate(updateTeamUser);

				selectRole(value);
			}
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
							onClick={() => {
								if (isTeamPage) updateUserRole(TeamUserRoles.MEMBER);
								else selectRole(TeamUserRoles.MEMBER);
							}}
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
							onClick={() => {
								if (isTeamPage) updateUserRole(TeamUserRoles.ADMIN);
								else selectRole(TeamUserRoles.ADMIN);
							}}
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
							onClick={() => {
								if (isTeamPage) updateUserRole(TeamUserRoles.STAKEHOLDER);
								else selectRole(TeamUserRoles.STAKEHOLDER);
							}}
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
	}
);

export default PopoverRoleSettings;
