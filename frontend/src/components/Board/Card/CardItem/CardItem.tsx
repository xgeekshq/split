import React, { useState } from 'react';

import { styled } from 'styles/stitches/stitches.config';

import AddCardOrComment from 'components/Board/AddCardOrComment';
import Flex from 'components/Primitives/Flex';
import Text from 'components/Primitives/Text';
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
}

const Container = styled(Flex, {
	py: '$12',
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
		isSubmited
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
						<Flex justify="between" css={{ '& > div': { zIndex: 2 } }}>
							<Text size="sm">{item.text}</Text>
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
							/>
						)}
					</Flex>
				)}
				{editing && !isSubmited && (
					<AddCardOrComment
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
