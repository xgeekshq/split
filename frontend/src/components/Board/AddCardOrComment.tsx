import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';

import { styled } from 'styles/stitches/stitches.config';

import Icon from 'components/icons/Icon';
import Button from 'components/Primitives/Button';
import Checkbox from 'components/Primitives/Checkbox';
import Flex from 'components/Primitives/Flex';
import TextArea from 'components/Primitives/TextArea';
import useCards from 'hooks/useCards';
import useComments from 'hooks/useComments';
import { SchemaAddCommentForm } from 'schema/schemaAddCommentForm';
import AddCardDto from 'types/card/addCard.dto';
import { CardToAdd } from 'types/card/card';
import UpdateCardDto from 'types/card/updateCard.dto';
import AddCommentDto from 'types/comment/addComment.dto';
import UpdateCommentDto from 'types/comment/updateComment.dto';

const ActionButton = styled(Button, {
	padding: '$10 $14 !important',

	svg: {
		width: '$16',
		height: '$16'
	}
});

const StyledForm = styled('form', Flex, { width: '100%' });

type AddCardProps = {
	isUpdate: boolean;
	isCard: boolean;
	colId: string;
	boardId: string;
	socketId: string;
	cardId?: string;
	cardItemId?: string;
	cardText?: string;
	commentId?: string;
	cancelUpdate?: () => void;
	defaultOpen?: boolean;
	isEditing?: boolean;
};

const AddCard = React.memo<AddCardProps>(
	({
		isUpdate,
		colId,
		boardId,
		socketId,
		cardId,
		cardItemId,
		cardText,
		cancelUpdate,
		isCard,
		commentId,
		isEditing = false,
		defaultOpen,
		...props
	}) => {
		const { addCardInColumn, updateCard } = useCards();
		const { addCommentInCard, updateComment } = useComments();
		const [isOpen, setIsOpen] = useState(!!isUpdate || !!cancelUpdate || defaultOpen);
		const [isAnonymous, setIsAnonymous] = useState(false);

		const methods = useForm<{ text: string }>({
			mode: 'onSubmit',
			reValidateMode: 'onChange',
			defaultValues: {
				text: cardText || ''
			},
			resolver: joiResolver(SchemaAddCommentForm)
		});

		const handleAddCard = (text: string) => {
			const newCard: CardToAdd = {
				items: [
					{
						text: text.trim(),
						votes: [],
						comments: [],
						anonymous: isAnonymous
					}
				],
				text: text.trim(),
				votes: [],
				comments: [],
				anonymous: isAnonymous
			};
			const changes: AddCardDto = {
				colIdToAdd: colId,
				boardId,
				card: newCard,
				socketId
			};

			addCardInColumn.mutate(changes);
			methods.reset({ text: '' });
		};

		const handleUpdateCard = (text: string) => {
			if (!cardId || !cancelUpdate) return;
			const cardUpdated: UpdateCardDto = {
				cardId,
				cardItemId: cardItemId ?? '',
				text,
				boardId,
				socketId,
				isCardGroup: !cardItemId
			};

			updateCard.mutate(cardUpdated);
			cancelUpdate();
		};

		const handleAddComment = (text: string) => {
			if (!cardId || !cancelUpdate) return;
			const commentDto: AddCommentDto = {
				cardId,
				cardItemId,
				text,
				boardId,
				socketId,
				isCardGroup: !cardItemId
			};

			addCommentInCard.mutate(commentDto);
			cancelUpdate();
		};

		const handleUpdateComment = (text: string) => {
			if (!cardId || !cancelUpdate || !commentId) return;
			const updateCommentDto: UpdateCommentDto = {
				cardId,
				cardItemId,
				text,
				boardId,
				socketId,
				isCardGroup: !cardItemId,
				commentId
			};

			updateComment.mutate(updateCommentDto);
			cancelUpdate();
		};

		const handleClear = () => {
			if ((isUpdate || !isCard) && cancelUpdate) {
				cancelUpdate();
				return;
			}

			methods.reset({ text: '' });
			setIsOpen(false);
		};

		const handleIsAnonymous = () => {
			if (isAnonymous === true) return setIsAnonymous(false);
			return setIsAnonymous(true);
		};

		if (!isOpen)
			return (
				<Button
					css={{
						mx: '$20',
						display: 'flex'
					}}
					onClick={() => setIsOpen(true)}
				>
					<Icon name="plus" />
					Add new card
				</Button>
			);

		return (
			<StyledForm
				{...props}
				direction="column"
				align="center"
				justify="center"
				gap="8"
				tabIndex={0}
				onSubmit={methods.handleSubmit(({ text }) => {
					if (isCard) {
						if (!isUpdate) {
							handleAddCard(text);
							return;
						}
						handleUpdateCard(text);
					}
					if (!isCard) {
						if (!isUpdate) {
							handleAddComment(text);
							return;
						}
						handleUpdateComment(text);
					}
				})}
			>
				<FormProvider {...methods}>
					<TextArea
						id="text"
						// variant={!isEmpty(cardText) ? default : undefined} }
						floatPlaceholder={false}
						placeholder="Write your comment here..."
					/>
					<Flex justify="end" gap="4" css={{ width: '100%' }}>
						{!isEditing && (
							<Checkbox
								setCheckedTerms={handleIsAnonymous}
								id="anonymous"
								label="Post anonymously"
								size="16"
							/>
						)}
						<ActionButton
							size="sm"
							css={{ width: '$48', height: '$36' }}
							variant={!isUpdate && isCard ? 'lightOutline' : 'primaryOutline'}
							onClick={handleClear}
						>
							<Icon name="close" />
						</ActionButton>
						<ActionButton
							css={{ width: '$48', height: '$36' }}
							size="sm"
							type="submit"
							variant="primary"
						>
							<Icon name="check" />
						</ActionButton>
					</Flex>
				</FormProvider>
			</StyledForm>
		);
	}
);
export default AddCard;
