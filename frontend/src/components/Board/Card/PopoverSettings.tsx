import React, { useState } from 'react';

import { styled } from 'styles/stitches/stitches.config';

import Icon from 'components/icons/Icon';
import {
	Popover,
	PopoverContent,
	PopoverItem,
	PopoverTrigger
} from 'components/Primitives/Popover';
import Text from 'components/Primitives/Text';
import { cardItemBlur } from 'helper/board/blurFilter';
import useCards from 'hooks/useCards';
import { CardItemType } from 'types/card/cardItem';

interface PopoverSettingsContentProps {
	isItem: boolean;
	isOwner: boolean;
	unmergeCard: () => void;
	setEditCard: () => void;
	setDeleteCard?: () => void;
}

const PopoverSettingsContent: React.FC<PopoverSettingsContentProps> = ({
	isItem,
	isOwner,
	unmergeCard,
	setEditCard,
	setDeleteCard
}) => {
	const [unmergeClickLock, setUnmergeClickLock] = useState(true);

	PopoverSettingsContent.defaultProps = {
		setDeleteCard: undefined
	};

	return (
		<PopoverContent portalled={false}>
			{isOwner && (
				<PopoverItem align="center" gap="8" onClick={setEditCard}>
					<Icon name="edit" />
					<Text size="sm" weight="medium">
						Edit
					</Text>
				</PopoverItem>
			)}
			{isItem && (
				<PopoverItem
					align="center"
					gap="8"
					onClick={
						unmergeClickLock
							? () => {
									unmergeCard();
									setUnmergeClickLock(false);
							  }
							: () => null
					}
				>
					<Icon name="arrow-long-right" />
					<Text size="sm" weight="medium">
						Unmerge card
					</Text>
				</PopoverItem>
			)}
			{isOwner && (
				<PopoverItem align="center" gap="8" onClick={setDeleteCard}>
					<Icon name="trash-alt" />
					<Text size="sm" weight="medium">
						Delete card
					</Text>
				</PopoverItem>
			)}
		</PopoverContent>
	);
};

interface PopoverSettingsProps {
	firstOne: boolean;
	isItem: boolean;
	columnId: string;
	boardId: string;
	cardGroupId?: string;
	socketId: string;
	itemId: string;
	newPosition: number;
	hideCards: boolean;
	userId: string;
	item: CardItemType;
	handleEditing: () => void;
	handleDeleteCard?: () => void;
}

const PopoverTriggerStyled = styled(PopoverTrigger, {
	variants: {
		disabled: {
			false: {
				'&:hover': {
					backgroundColor: '$primary500',
					color: 'white'
				}
			},
			true: {
				'&:hover': {
					backgroundColor: '$transparent'
				}
			}
		}
	},
	defaultVariants: { disabled: false }
});

const PopoverCardSettings: React.FC<PopoverSettingsProps> = React.memo(
	({
		firstOne,
		itemId,
		columnId,
		boardId,
		cardGroupId,
		socketId,
		newPosition,
		isItem,
		handleEditing,
		handleDeleteCard,
		item,
		userId,
		hideCards
	}) => {
		const { removeFromMergeCard } = useCards();

		const unmergeCard = () => {
			if (!cardGroupId) return;
			removeFromMergeCard.mutate({
				boardId,
				cardGroupId,
				columnId,
				socketId,
				cardId: itemId,
				newPosition
			});
		};

		return (
			<Popover>
				<PopoverTriggerStyled
					disabled={hideCards && item.createdBy?._id !== userId}
					css={{
						position: 'relative',
						top: firstOne ? '-35px' : 0
					}}
				>
					<Icon
						name="menu-dots"
						css={{
							width: '$20',
							height: '$20',
							filter: cardItemBlur(hideCards, item as CardItemType, userId)
						}}
					/>
				</PopoverTriggerStyled>

				<PopoverSettingsContent
					isItem={isItem}
					isOwner={item.createdBy?._id === userId}
					setDeleteCard={handleDeleteCard}
					setEditCard={handleEditing}
					unmergeCard={unmergeCard}
				/>
			</Popover>
		);
	}
);

export default PopoverCardSettings;
