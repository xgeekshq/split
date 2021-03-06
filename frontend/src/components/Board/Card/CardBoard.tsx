import React, { useMemo, useState } from 'react';
import { Draggable } from '@react-forked/dnd';

import { styled } from 'styles/stitches/stitches.config';

import Icon from 'components/icons/Icon';
import Flex from 'components/Primitives/Flex';
import Text from 'components/Primitives/Text';
import { cardBlur } from 'helper/board/blurFilter';
import { getCommentsFromCardGroup } from 'helper/board/comments';
import { BoardUser } from 'types/board/board.user';
import CardType from 'types/card/card';
import AddCardOrComment from '../AddCardOrComment';
import Comments from '../Comment/Comments';
import CardFooter from './CardFooter';
import CardItemList from './CardItem/CardItemList';
import DeleteCard from './DeleteCard';
import PopoverCardSettings from './PopoverSettings';

const Container = styled(Flex, {
	borderRadius: '$8',
	p: '$16',
	wordBreak: 'breakWord'
});

interface CardBoardProps {
	color: string;
	card: CardType;
	index: number;
	colId: string;
	userId: string;
	boardId: string;
	socketId: string;
	isMainboard: boolean;
	boardUser?: BoardUser;
	maxVotes?: number;
	isSubmited: boolean;
	hideCards: boolean;
}

const CardBoard = React.memo<CardBoardProps>(
	({
		card,
		index,
		color,
		boardId,
		socketId,
		userId,
		colId,
		isMainboard,
		boardUser,
		maxVotes,
		isSubmited,
		hideCards
	}) => {
		const isCardGroup = card.items.length > 1;
		const comments = useMemo(() => {
			return card.items.length === 1
				? card.items[0].comments
				: getCommentsFromCardGroup(card);
		}, [card]);

		const [isCommentsOpened, setOpenComments] = useState(false);
		const [editing, setEditing] = useState(false);
		const [deleting, setDeleting] = useState(false);

		const handleOpenComments = () => {
			if (hideCards && card.createdBy?._id !== userId) return;
			setOpenComments(!isCommentsOpened);
		};

		const handleEditing = () => {
			setEditing(!editing);
		};

		const handleDeleting = () => {
			setDeleting(!deleting);
		};
		return (
			<Draggable
				key={card._id}
				draggableId={card._id}
				index={index}
				isDragDisabled={isSubmited}
			>
				{(provided) => (
					<Flex
						ref={provided.innerRef}
						{...provided.dragHandleProps}
						{...provided.draggableProps}
						direction="column"
						css={{
							backgroundColor: color,
							borderRadius: '$8',
							mb: '$12'
						}}
					>
						<Container
							direction="column"
							css={{
								cursor: 'grab',
								backgroundColor: color,
								py: !isCardGroup ? '$16' : '$8',
								mb: isCardGroup ? '$12' : 'none'
							}}
						>
							{editing && !isSubmited && (
								<AddCardOrComment
									isCard
									isEditing
									isUpdate
									boardId={boardId}
									cancelUpdate={handleEditing}
									cardId={card._id}
									cardItemId={card.items[0]._id}
									cardText={card.text}
									colId={colId}
									socketId={socketId}
								/>
							)}
							{!editing && (
								<Flex direction="column">
									{isCardGroup && (
										<Flex css={{ py: '$8' }} justify="between">
											<Flex align="center" gap="4">
												<Icon
													css={{ width: '$14', height: '$14' }}
													name="merge"
												/>
												<Text size="xxs" weight="medium">
													{card.items.length} merged cards
												</Text>
											</Flex>
										</Flex>
									)}
									{!isCardGroup && (
										<Flex
											css={{ mb: '$14', '& > div': { zIndex: 2 } }}
											justify="between"
										>
											<Text
												size="md"
												css={{
													wordBreak: 'break-word',

													filter: cardBlur(
														hideCards,
														card as CardType,
														userId
													)
												}}
											>
												{card.text}
											</Text>
											{isSubmited && (
												<Icon
													css={{ width: '$20', height: '$20' }}
													name="menu-dots"
												/>
											)}

											{!isSubmited && userId === card?.createdBy?._id && (
												<PopoverCardSettings
													boardId={boardId}
													cardGroupId={card._id}
													columnId={colId}
													firstOne={false}
													handleDeleteCard={handleDeleting}
													handleEditing={handleEditing}
													hideCards={hideCards}
													isItem={false}
													item={card}
													itemId={card.items[0]._id}
													newPosition={0}
													socketId={socketId}
													userId={userId}
												/>
											)}
										</Flex>
									)}
									{card.items && isCardGroup && (
										<CardItemList
											boardId={boardId}
											cardGroupId={card._id}
											cardGroupPosition={index}
											color={color}
											columnId={colId}
											hideCards={hideCards}
											isMainboard={isMainboard}
											isSubmited={isSubmited}
											items={card.items}
											socketId={socketId}
											submitedByTeam={card?.createdByTeam}
											userId={userId}
										/>
									)}
									<CardFooter
										anonymous={card.items[card.items.length - 1 || 0].anonymous}
										boardId={boardId}
										boardUser={boardUser}
										card={card}
										comments={comments}
										hideCards={hideCards}
										isCommentsOpened={isCommentsOpened}
										isItem={false}
										isMainboard={isMainboard}
										maxVotes={maxVotes}
										setOpenComments={handleOpenComments}
										socketId={socketId}
										teamName={card?.createdByTeam}
										userId={userId}
									/>
								</Flex>
							)}
							{deleting && (
								<DeleteCard
									boardId={boardId}
									cardId={card._id}
									cardTitle={card.text}
									handleClose={handleDeleting}
									socketId={socketId}
								/>
							)}
						</Container>
						{isCommentsOpened && (
							<Comments
								boardId={boardId}
								cardId={card._id}
								cardItems={card.items}
								comments={comments}
								hideCards={hideCards}
								isSubmited={isSubmited}
								socketId={socketId}
								userId={userId}
							/>
						)}
					</Flex>
				)}
			</Draggable>
		);
	}
);

export default CardBoard;
