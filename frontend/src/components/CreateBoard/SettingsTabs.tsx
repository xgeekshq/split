import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useRecoilValue } from 'recoil';

import { styled } from 'styles/stitches/stitches.config';

import Flex from 'components/Primitives/Flex';
import Separator from 'components/Primitives/Separator';
import Text from 'components/Primitives/Text';
import { createBoardError } from 'store/createBoard/atoms/create-board.atom';
import BoardConfigurations from './Configurations/BoardConfigurations';
import TeamSubTeamsConfigurations from './SubTeamsTab/TeamSubTeamsConfigurations';

const StyledTextTab = styled(Text, {
	pb: '$12 !important',
	lineHeight: '$20',
	'&:hover': {
		cursor: 'pointer'
	},
	'&[data-activetab="true"]': {
		boxSizing: 'border-box',
		borderBottom: '2px solid $colors$primary800',
		fontWeight: '$bold',
		fontSize: '$16',
		letterSpacing: '$0-2',
		color: '$primary800'
	}
});

const Settings = () => {
	const [currentTab, setCurrentTab] = useState(1);
	const [timesOpen, setTimesOpen] = useState<number>(0);

	/**
	 * Recoil Atoms
	 */
	const haveError = useRecoilValue(createBoardError);

	const {
		formState: { errors }
	} = useFormContext();

	useEffect(() => {
		if (errors.maxVotes) {
			setCurrentTab(2);
		}
	}, [errors.maxVotes]);

	return (
		<Flex direction="column">
			<Flex gap="24" css={{ width: '100%' }}>
				<StyledTextTab
					data-activetab={currentTab === 1}
					size="md"
					color="primary300"
					onClick={!haveError ? () => setCurrentTab(1) : undefined}
				>
					Team/-Sub-teams configurations
				</StyledTextTab>
				<StyledTextTab
					data-activetab={currentTab === 2}
					size="md"
					color="primary300"
					onClick={!haveError ? () => setCurrentTab(2) : undefined}
				>
					Configurations
				</StyledTextTab>
			</Flex>
			<Separator
				orientation="horizontal"
				css={{ position: 'relative', top: '-1px', zIndex: '-1' }}
			/>
			{currentTab === 1 && (
				<TeamSubTeamsConfigurations
					timesOpen={timesOpen}
					setTimesOpen={() => setTimesOpen(timesOpen + 1)}
				/>
			)}
			{currentTab === 2 && <BoardConfigurations />}
		</Flex>
	);
};

export default Settings;
