import React, { useState } from 'react';

import { styled } from 'styles/stitches/stitches.config';

import AddCardOrComment from 'components/Board/AddCardOrComment';
import Icon from 'components/icons/Icon';
import Flex from 'components/Primitives/Flex';
import Text from 'components/Primitives/Text';
import { cardItemBlur } from 'helper/board/blurFilter';
import { CardItemType } from 'types/card/cardItem';
import CardFooter from '../CardFooter';
import DeleteCard from '../DeleteCard';
import PopoverCardSettings from '../PopoverSettings';

interface CardItemProps {
	item: CardItemType;
	color: string;
	teamName?: string;
	lastOne?: boolean;
	firstOne: boolean;
	columnId: string;
	boardId: string;
	cardGroupId: string;
	socketId: string;
	cardGroupPosition: number;
	anonymous: boolean;
	userId: string;
	isMainboard: boolean;
	isSubmited: boolean;
	hideCards: boolean;
}

const Container = styled(Flex, {
	paddingTop: '$12',
	paddingBottom: '$14',
	wordBreak: 'breakWord'
});

const CardItem: React.FC<CardItemProps> = React.memo(
	({
		item,
		color,
		teamName,
		firstOne,
		lastOne,
		columnId,
		boardId,
		cardGroupId,
		socketId,
		cardGroupPosition,
		anonymous,
		userId,
		isMainboard,
		isSubmited,
		hideCards
	}) => {
		const [editing, setEditing] = useState(false);
		const [deleting, setDeleting] = useState(false);

		const handleDeleting = () => {
			setDeleting(!deleting);
		};

		const handleEditing = () => {
			setEditing(!editing);
		};

		return (
			<Container
				gap="10"
				direction="column"
				css={{ backgroundColor: color }}
				justify="between"
			>
				{!editing && (
					<Flex direction="column">
						<Flex
							justify="between"
							css={{ '& > div': { zIndex: 2 }, mb: lastOne ? 0 : '$12' }}
						>
							<Text
								size="sm"
								css={{
									filter: cardItemBlur(hideCards, item as CardItemType, userId)
								}}
							>
								{item.text}
							</Text>
							{isSubmited && (
								<Flex
									css={{
										position: 'relative',
										top: firstOne ? '-35px' : 0,
										filter: cardItemBlur(
											hideCards,
											item as CardItemType,
											userId
										)
									}}
								>
									<Icon
										name="menu-dots"
										css={{
											width: '$20',
											height: '$20'
										}}
									/>
								</Flex>
							)}
							{!isSubmited && userId === item?.createdBy?._id && (
								<PopoverCardSettings
									firstOne={firstOne}
									columnId={columnId}
									boardId={boardId}
									cardGroupId={cardGroupId}
									socketId={socketId}
									itemId={item._id}
									newPosition={cardGroupPosition}
									isItem
									handleEditing={handleEditing}
									handleDeleteCard={handleDeleting}
									item={item}
									hideCards={hideCards}
									userId={userId}
								/>
							)}
						</Flex>

						{!lastOne && (
							<CardFooter
								card={item}
								teamName={teamName}
								isItem
								boardId={boardId}
								socketId={socketId}
								userId={userId}
								anonymous={anonymous}
								isMainboard={isMainboard}
								hideCards={hideCards}
							/>
						)}
					</Flex>
				)}
				{editing && !isSubmited && (
					<AddCardOrComment
						isEditing
						isCard
						isUpdate
						colId={columnId}
						boardId={boardId}
						socketId={socketId}
						cardId={cardGroupId}
						cardItemId={item._id}
						cardText={item.text}
						cancelUpdate={handleEditing}
					/>
				)}
				{deleting && (
					<DeleteCard
						cardTitle={item.text}
						boardId={boardId}
						cardId={cardGroupId}
						socketId={socketId}
						cardItemId={item._id}
						handleClose={handleDeleting}
					/>
				)}
			</Container>
		);
	}
);

export default CardItem;
