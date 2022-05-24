import React from 'react';
import { useRecoilValue } from 'recoil';

import { createBoardError } from '../../store/createBoard/atoms/create-board.atom';
import Input from '../Primitives/Input';
import Text from '../Primitives/Text';

type Props = { mainBoardName: string };

const BoardName = ({ mainBoardName }: Props) => {
	/**
	 * Recoil Atoms
	 */
	const haveError = useRecoilValue(createBoardError);

	return (
		<>
			<Text heading="3">Main Board Name</Text>
			<Text css={{ mt: '$8', mb: '$16', color: '$primary500' }}>
				The main board is the board into which all sub-team boards will be merged.
			</Text>
			<Input
				disabled={haveError}
				state="default"
				id="text"
				type="text"
				placeholder="Main board name"
				forceState
				currentValue={mainBoardName}
				maxChars="30"
			/>
		</>
	);
};

export default BoardName;
