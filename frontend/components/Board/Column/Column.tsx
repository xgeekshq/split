import { Droppable } from '@react-forked/dnd';
import React from 'react';

import { styled } from '../../../stitches.config';
import { ColumnBoardType } from '../../../types/column';
import Box from '../../Primitives/Box';
import Flex from '../../Primitives/Flex';
import Text from '../../Primitives/Text';
import Separator from '../../Sidebar/partials/Separator';
import AddCardOrComment from '../AddCardOrComment';
import CardsList from './CardsList';
import { CardsContainer } from './styles';

const Container = styled(Flex, Box, {
	borderRadius: '$12',
	flexShrink: 0,
	flex: '1',
	pb: '$24',
	width: '100%',
	boxShadow: '0px 2px 8px rgba(18, 25, 34, 0.05)',
	backgroundColor: '$surface'
});

const OuterContainer = styled(Flex, {
	height: 'fit-content',

	flex: '1',
	flexGrow: 1,
	flexShrink: 0,
	width: '100%'
});

const Title = styled(Text, {
	px: '$8'
});

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
		isSubmited,
		filter
	}) => {
		return (
			<OuterContainer>
				<Droppable droppableId={columnId} type="CARD" isCombineEnabled>
					{(provided) => (
						<Container direction="column" elevation="2">
							<Flex css={{ pl: '$16', pt: '$20', pb: '$16' }}>
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
							<Separator css={{ backgroundColor: '$primary100', mb: '$20' }} />
							<Flex direction="column" css={{}}>
								{!isSubmited && (
									<AddCardOrComment
										isCard
										colId={columnId}
										boardId={boardId}
										socketId={socketId}
										isUpdate={false}
										defaultOpen={countAllCards === 0}
									/>
								)}
								<CardsContainer
									direction="column"
									ref={provided.innerRef}
									{...provided.droppableProps}
								>
									<CardsList
										cards={cards}
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
										filter={filter}
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
