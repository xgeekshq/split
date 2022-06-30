import React, { useState } from 'react';
import { Droppable } from '@react-forked/dnd';

import Flex from 'components/Primitives/Flex';
import Separator from 'components/Primitives/Separator';
import Text from 'components/Primitives/Text';
import { ColumnBoardType } from 'types/column';
import AddCardOrComment from '../AddCardOrComment';
import CardsList from './CardsList';
import { SortMenu } from './partials/SortMenu';
import { CardsContainer, Container, OuterContainer, Title } from './styles';

const Column = React.memo<ColumnBoardType>(
	({
		columnId,
		cards,
		userId,
		boardId,
		title,
		color,
		socketId,
		anonymous,
		isMainboard,
		boardUser,
		maxVotes,
		countAllCards,
		isSubmited
	}) => {
		const [filter, setFilter] = useState<'asc' | 'desc' | undefined>();

		const filteredCards = () => {
			switch (filter) {
				case 'desc':
					return [...cards].sort((a, b) => {
						const votesA =
							a.items.length === 1 ? a.items[0].votes.length : a.votes.length;
						const votesB =
							b.items.length === 1 ? b.items[0].votes.length : b.votes.length;
						return votesA - votesB;
					});
				case 'asc':
					return [...cards].sort((a, b) => {
						const votesA =
							a.items.length === 1 ? a.items[0].votes.length : a.votes.length;
						const votesB =
							b.items.length === 1 ? b.items[0].votes.length : b.votes.length;
						return votesB - votesA;
					});
				default:
					return cards;
			}
		};

		return (
			<OuterContainer>
				<Droppable droppableId={columnId} type="CARD" isCombineEnabled>
					{(provided) => (
						<Container direction="column" elevation="2">
							<Flex css={{ pt: '$20', px: '$20', pb: '$16' }} justify="between">
								<Flex>
									<Title heading="4">{title}</Title>
									<Text
										size="xs"
										color="primary400"
										css={{
											borderRadius: '$4',
											border: '1px solid $colors$primary100',
											px: '$8',
											py: '$2'
										}}
									>
										{cards.length} cards
									</Text>
								</Flex>

								<SortMenu
									disabled={!isMainboard}
									setFilter={setFilter}
									filter={filter}
								/>
							</Flex>
							<Separator css={{ backgroundColor: '$primary100', mb: '$20' }} />
							<Flex direction="column" css={{}}>
								{!isSubmited && (
									<Flex
										css={{
											'&>*': { flex: '1 1 auto' },
											'&>form': { px: '$20' }
										}}
										align="center"
									>
										<AddCardOrComment
											isCard
											colId={columnId}
											boardId={boardId}
											socketId={socketId}
											isUpdate={false}
											defaultOpen={countAllCards === 0}
										/>
									</Flex>
								)}
								<CardsContainer
									direction="column"
									ref={provided.innerRef}
									{...provided.droppableProps}
								>
									<CardsList
										cards={filter ? filteredCards() : cards}
										color={color}
										colId={columnId}
										userId={userId}
										boardId={boardId}
										socketId={socketId}
										anonymous={anonymous}
										isMainboard={isMainboard}
										boardUser={boardUser}
										maxVotes={maxVotes}
										isSubmited={isSubmited}
									/>
									{provided.placeholder}
								</CardsContainer>
							</Flex>
						</Container>
					)}
				</Droppable>
			</OuterContainer>
		);
	}
);
export default Column;
