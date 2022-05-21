import React, { useMemo } from 'react';

import { getCardVotes } from '../../../helper/board/votes';
import useVotes from '../../../hooks/useVotes';
import { styled } from '../../../stitches.config';
import { BoardUser } from '../../../types/board/board.user';
import CardType from '../../../types/card/card';
import { CardItemType } from '../../../types/card/cardItem';
import CommentType from '../../../types/comment/comment';
import { getRandomColor } from '../../../utils/initialNames';
import Icon from '../../icons/Icon';
import Avatar from '../../Primitives/Avatar';
import Button from '../../Primitives/Button';
import Flex from '../../Primitives/Flex';
import Text from '../../Primitives/Text';

interface FooterProps {
	boardId: string;
	userId: string;
	socketId: string | undefined;
	card: CardType | CardItemType;
	anonymous: boolean;
	isItem: boolean;
	teamName?: string;
	isMainboard: boolean;
	setOpenComments?: () => void;
	comments?: CommentType[];
	isCommentsOpened?: boolean;
	boardUser?: BoardUser;
	maxVotes?: number;
}

const StyledButtonIcon = styled(Button, {
	m: '0 !important',
	p: '0 !important',
	lineHeight: '0 !important',
	height: 'fit-content !important',
	backgroundColor: 'transparent !important',
	'& svg': {
		color: '$primary500'
	},
	'@hover': {
		'&:hover': {
			backgroundColor: 'transparent !important'
		}
	},
	'&:active': {
		boxShadow: 'none !important'
	},
	'&:disabled': {
		svg: {
			opacity: '0.2'
		}
	}
});

const CardFooter = React.memo<FooterProps>(
	({
		boardId,
		userId,
		socketId,
		card,
		anonymous,
		teamName,
		isItem,
		isMainboard,
		comments,
		boardUser,
		maxVotes,
		setOpenComments,
		isCommentsOpened
	}) => {
		const { createdBy } = card;

		const { addVote, deleteVote } = useVotes();
		const actualBoardVotes = boardUser?.votesCount;

		const votesData = useMemo(() => {
			if (Object.hasOwnProperty.call(card, 'items')) {
				const cardTyped = card as CardType;
				const cardItemId =
					cardTyped.items.length === 1 ? cardTyped.items[0]._id : undefined;

				const votesInThisCard =
					cardTyped.items.length === 1
						? cardTyped.items[0].votes
						: getCardVotes(cardTyped);

				const votesOfUserInThisCard = votesInThisCard.filter(
					(vote) => vote === userId
				).length;
				return { cardItemId, votesOfUserInThisCard, votesInThisCard };
			}
			return { cardItemId: undefined, votesOfUserInThisCard: 0, votesInThisCard: [] };
		}, [card, userId]);

		const { cardItemId, votesOfUserInThisCard, votesInThisCard } = votesData;

		const handleDeleteVote = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
			event.stopPropagation();
			if (votesOfUserInThisCard <= 0) return;
			deleteVote.mutate({
				boardId,
				cardId: card._id,
				socketId,
				cardItemId,
				isCardGroup: cardItemId === undefined
			});
		};

		const handleAddVote = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
			event.stopPropagation();
			if (maxVotes && actualBoardVotes && actualBoardVotes >= maxVotes) return;
			addVote.mutate({
				boardId,
				cardId: card._id,
				socketId,
				cardItemId,
				isCardGroup: cardItemId === undefined
			});
		};

		const color = useMemo(() => {
			return getRandomColor();
		}, []);

		return (
			<Flex align="center" justify={!anonymous ? 'between' : 'end'} gap="6">
				{!anonymous && !teamName && (
					<Flex gap="4" align="center">
						<Avatar
							size={20}
							colors={color}
							fallbackText={`${createdBy?.firstName[0]}${createdBy?.lastName[0]}`}
							isBoardPage
						/>
						<Text size="xs">
							{createdBy?.firstName} {createdBy?.lastName}
						</Text>
					</Flex>
				)}
				{teamName && (
					<Text size="xs" weight="medium">
						{teamName}
					</Text>
				)}
				{!isItem && comments && (
					<Flex gap="10" align="center">
						<Flex align="center" gap="2">
							<StyledButtonIcon
								onClick={handleAddVote}
								disabled={!isMainboard || actualBoardVotes === maxVotes}
							>
								<Icon name="thumbs-up" />
							</StyledButtonIcon>
							<Text
								size="xs"
								css={{
									visibility: votesInThisCard.length > 0 ? 'visible' : 'hidden',
									width: '10px'
								}}
							>
								{votesInThisCard.length}
							</Text>
						</Flex>

						<Flex align="center" gap="2" css={{ mr: '$10' }}>
							<StyledButtonIcon
								onClick={handleDeleteVote}
								disabled={!isMainboard || votesOfUserInThisCard === 0}
							>
								<Icon name="thumbs-down" />
							</StyledButtonIcon>
						</Flex>

						<Flex align="center" gap="2">
							<StyledButtonIcon onClick={setOpenComments}>
								<Icon
									name={
										!!comments?.find(
											(comment) => comment.createdBy._id === userId
										) || !!isCommentsOpened
											? 'comment-filled'
											: 'comment'
									}
								/>
							</StyledButtonIcon>
							<Text
								size="xs"
								css={{ visibility: comments.length > 0 ? 'visible' : 'hidden' }}
							>
								{comments.length}
							</Text>
						</Flex>
					</Flex>
				)}
			</Flex>
		);
	}
);

export default CardFooter;
