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
							card={card}
							index={idx}
							color={color}
							colId={colId}
							userId={userId}
							boardId={boardId}
							socketId={socketId}
							isMainboard={isMainboard}
							boardUser={boardUser}
							maxVotes={maxVotes}
							isSubmited={isSubmited}
							hideCards={hideCards}
						/>
					);
				})}
			</>
		);
	}
);

export default CardsList;
