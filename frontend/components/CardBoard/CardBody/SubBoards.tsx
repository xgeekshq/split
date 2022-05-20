import React from 'react';

import BoardType from '../../../types/board/board';
import Flex from '../../Primitives/Flex';

type SubBoardsProps = {
	isDashboard: boolean;
	isSubBoard: boolean | undefined;
	dividedBoards: BoardType[];
	userId: string;
	renderCardBody: (subBoard: BoardType, idx: number) => JSX.Element;
};

const SubBoards = React.memo(
	({ isSubBoard, isDashboard, dividedBoards, renderCardBody, userId }: SubBoardsProps) => {
		if (isSubBoard) return null;
		if (isDashboard) {
			return (
				<Flex direction="column" gap="8">
					{dividedBoards.map((subBoard, idx) => {
						return subBoard.users.find((boardUser) => boardUser.user._id === userId)
							? renderCardBody(subBoard, idx)
							: null;
					})}
				</Flex>
			);
		}
		return (
			<Flex direction="column" gap="8">
				{dividedBoards.map((subBoard, idx) => {
					return renderCardBody(subBoard, idx);
				})}
			</Flex>
		);
	}
);

export default SubBoards;
