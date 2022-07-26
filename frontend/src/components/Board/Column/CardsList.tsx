import React from 'react';

import CardType from 'types/card/card';
import { ColumnInnerList } from 'types/column';
import CardBoard from '../Card/CardBoard';

const CardsList = React.memo<ColumnInnerList>(
	({
		cards,
		color,
		colId,
		userId,
		boardId,
		socketId,
		isMainboard,
		boardUser,
		maxVotes,
		isSubmited,
		hideCards
	}) => {
		return (
			<>
				{cards.map((card: CardType, idx) => {
					return (
						<CardBoard
							key={card._id}
							boardId={boardId}
							boardUser={boardUser}
							card={card}
							colId={colId}
							color={color}
							hideCards={hideCards}
							index={idx}
							isMainboard={isMainboard}
							isSubmited={isSubmited}
							maxVotes={maxVotes}
							socketId={socketId}
							userId={userId}
						/>
					);
				})}
			</>
		);
	}
);

export default CardsList;
