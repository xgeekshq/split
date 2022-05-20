import React from 'react';

import CardType from '../../../types/card/card';
import { ColumnInnerList } from '../../../types/column';
import CardBoard from '../Card/CardBoard';

const CardsList = React.memo<ColumnInnerList>(
	({
		cards,
		color,
		colId,
		userId,
		boardId,
		socketId,
		anonymous,
		isMainboard,
		boardUser,
		maxVotes,
		isSubmited
	}) => {
		return (
			<>
				{cards.map((card: CardType, idx) => {
					return (
						<CardBoard
							key={card._id}
							card={card}
							index={idx}
							color={color}
							colId={colId}
							userId={userId}
							boardId={boardId}
							socketId={socketId}
							anonymous={anonymous}
							isMainboard={isMainboard}
							boardUser={boardUser}
							maxVotes={maxVotes}
							isSubmited={isSubmited}
						/>
					);
				})}
			</>
		);
	}
);

export default CardsList;
