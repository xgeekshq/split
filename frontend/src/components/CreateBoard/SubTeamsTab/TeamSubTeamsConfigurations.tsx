import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { styled } from 'styles/stitches/stitches.config';

import { getStakeholders } from 'api/boardService';
import { getAllTeams } from 'api/teamService';
import Icon from 'components/icons/Icon';
import Box from 'components/Primitives/Box';
import Flex from 'components/Primitives/Flex';
import Text from 'components/Primitives/Text';
import Tooltip from 'components/Primitives/Tooltip';
import {
	CreateBoardData,
	createBoardDataState,
	createBoardError
} from 'store/createBoard/atoms/create-board.atom';
import { toastState } from 'store/toast/atom/toast.atom';
import { Team } from 'types/team/team';
import MainBoardCard from './MainBoardCard';
import QuickEditSubTeams from './QuickEditSubTeams';

const StyledBox = styled(Flex, Box, { borderRadius: '$12', backgroundColor: 'white' });

const TeamSubTeamsConfigurations: React.FC = () => {
	/**
	 * Recoil Atoms and hooks
	 */
	const setBoardData = useSetRecoilState<CreateBoardData>(createBoardDataState);
	const setToastState = useSetRecoilState(toastState);
	const [haveError, setHaveError] = useRecoilState(createBoardError);
	const MIN_MEMBERS = 4;

	/**
	 * States
	 */
	const [team, setTeam] = useState<Team>();
	// TODO: if stakeholders change type on future, it's necessary change the type of useStates
	const [stakeholders, setStakeholders] = useState<string[]>([]);

	/**
	 * Queries to retrive data
	 */
	const { data } = useQuery(['teams'], () => getAllTeams(), { suspense: false });
	const { data: dataStakeholders } = useQuery(['stakeholders'], () => getStakeholders(), {
		suspense: false
	});

	/**
	 * Use Effect to validate if exist any team created
	 * If yes, save on state and on board data atom
	 * If no, redirect to previous router and show a toastr
	 */
	useEffect(() => {
		if ((data && !data[0]) || (team?.users.length && team?.users.length < MIN_MEMBERS)) {
			setHaveError(true);
		} else if (data && data[0]) {
			setTeam(data[0]);
			setBoardData((prev) => ({ ...prev, board: { ...prev.board, team: data[0]._id } }));
		}
	}, [data, setBoardData, setHaveError, setToastState, team?.users.length]);

	/**
	 * Use Effect to validate if staheolders return data
	 * If ues, save on state
	 */
	useEffect(() => {
		if (dataStakeholders) {
			setStakeholders(dataStakeholders);
		}
	}, [dataStakeholders]);

	return (
		<Flex css={{ mt: '$32' }} direction="column">
			<Flex gap="22" justify="between" css={{ width: '100%' }}>
				<StyledBox
					elevation="1"
					direction="column"
					gap="2"
					css={{ width: '100%', py: '$12', pl: '$17', pr: '$16' }}
				>
					<Text size="xs" color="primary300">
						Team
					</Text>
					<Flex gap="8" align="center">
						<Text size="md">{haveError ? '' : team?.name}</Text>
						<Text size="md" color="primary300">
							({haveError ? '--' : team?.users.length} members)
						</Text>
						<Tooltip content="All active members on the platform">
							<div>
								<Icon
									name="info"
									css={{
										width: '$14',
										height: '$14',
										color: '$primary400'
									}}
								/>
							</div>
						</Tooltip>
					</Flex>
				</StyledBox>
				<StyledBox
					elevation="1"
					direction="column"
					gap="2"
					css={{ width: '100%', py: '$12', pl: '$17', pr: '$16' }}
				>
					<Text size="xs" color="primary300">
						Stakeholders
					</Text>
					<Text size="md" css={{ wordBreak: 'break-word' }}>
						{haveError
							? ''
							: team?.users
									.filter((teamUser) =>
										stakeholders?.includes(teamUser.user.email)
									)
									.map(
										(stakeholderFound) =>
											`${stakeholderFound.user.firstName} ${stakeholderFound.user.lastName}`
									)}
					</Text>
				</StyledBox>
			</Flex>
			{team && (
				<>
					<Flex justify="end">
						<QuickEditSubTeams team={team} stakeholders={stakeholders} />
					</Flex>
					<MainBoardCard team={team} stakeholders={stakeholders} />
				</>
			)}
		</Flex>
	);
};

export default TeamSubTeamsConfigurations;
