import React from 'react';
import { useSetRecoilState } from 'recoil';

import Icon from 'components/icons/Icon';
import Flex from 'components/Primitives/Flex';
import { membersListState } from '../../../../store/team/atom/team.atom';
import { TeamUser } from '../../../../types/team/team.user';
import { User } from '../../../../types/user/user';
import { ConfigurationSettings } from '../../../Board/Settings/partials/ConfigurationSettings';
import CardEnd from '../CardEnd';
import { InnerContainer, StyledMemberTitle } from './styles';

type CardBodyProps = {
	member: User;
	role: string;
	isTeamCreator?: boolean;
	isNewJoiner?: boolean;
	membersList: TeamUser[];
};

const CardMember = React.memo<CardBodyProps>(
	({ member, role, isTeamCreator, isNewJoiner, membersList }) => {
		const setMembersList = useSetRecoilState(membersListState);

		const handleIsNewJoiner = (checked: boolean) => {
			const listUsersMembers = membersList.map((user) => {
				return user.user._id === member._id ? { ...user, isNewJoiner: checked } : user;
			});

			setMembersList(listUsersMembers);
		};

		return (
			<Flex css={{ flex: '1 1 1', marginBottom: '$10' }} direction="column" gap="12">
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
						<Flex align="center" css={{ width: '23%' }} gap="8">
							<Icon
								name="blob-personal"
								css={{
									width: '32px',
									height: '$32',
									zIndex: 1
								}}
							/>

							<Flex align="center" gap="8">
								<StyledMemberTitle>
									{`${member.firstName} ${member.lastName}`}
								</StyledMemberTitle>
							</Flex>
						</Flex>
						<Flex align="center" css={{ width: '23%' }} gap="8" justify="center">
							<ConfigurationSettings
								handleCheckedChange={handleIsNewJoiner}
								isChecked={isNewJoiner || false}
								text=""
								title="New Joiner"
							/>
						</Flex>
						<CardEnd isTeamCreator={isTeamCreator} role={role} userId={member._id} />
					</InnerContainer>
				</Flex>
			</Flex>
		);
	}
);

export default CardMember;
