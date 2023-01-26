import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import Button from '@/components/Primitives/Button';
import Checkbox from '@/components/Primitives/Checkbox';
import Flex from '@/components/Primitives/Flex';
import TextArea from '@/components/Primitives/TextArea';
import useCards from '@/hooks/useCards';
import useComments from '@/hooks/useComments';
import { SchemaAddCommentForm } from '@/schema/schemaAddCommentForm';
import AddCardDto from '@/types/card/addCard.dto';
import { CardToAdd } from '@/types/card/card';
import UpdateCardDto from '@/types/card/updateCard.dto';
import AddCommentDto from '@/types/comment/addComment.dto';
import UpdateCommentDto from '@/types/comment/updateComment.dto';
import { styled } from '@/styles/stitches/stitches.config';
import Icon from '../icons/Icon';

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
  anonymous: boolean;
  isDefaultText: boolean;
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
    isDefaultText,
    cancelUpdate,
    isCard,
    commentId,
    isEditing = false,
    defaultOpen,
    anonymous,
    ...props
  }) => {
    const { addCardInColumn, updateCard } = useCards();
    const { addCommentInCard, updateComment } = useComments();
    const [isOpen, setIsOpen] = useState(!!isUpdate || !!cancelUpdate || defaultOpen);
    const [isAnonymous, setIsAnonymous] = useState(anonymous);
    const [isCommentAnonymous, setIsCommentAnonymous] = useState(anonymous);

    const methods = useForm<{ text: string }>({
      mode: 'onSubmit',
      reValidateMode: 'onChange',
      defaultValues: {
        text: '',
      },
      resolver: joiResolver(SchemaAddCommentForm),
    });

    const watchCardTextInput = methods.watch();
    const disabledButton = watchCardTextInput.text?.trim().length === 0;

    const handleAddCard = (text: string) => {
      if (text.trim().length === 0) return;
      const newCard: CardToAdd = {
        items: [
          {
            text: text.trim(),
            votes: [],
            comments: [],
            anonymous: isAnonymous,
          },
        ],
        text: text.trim(),
        votes: [],
        comments: [],
        anonymous: isAnonymous,
      };
      const changes: AddCardDto = {
        colIdToAdd: colId,
        boardId,
        card: newCard,
        socketId,
      };

      addCardInColumn.mutate(changes);
      methods.reset({ text: '' });
    };

    const handleUpdateCard = (text: string) => {
      if (!cardId || !cancelUpdate) return;
      if (text.trim().length === 0) return;
      const cardUpdated: UpdateCardDto = {
        cardId,
        cardItemId: cardItemId ?? '',
        text,
        boardId,
        socketId,
        isCardGroup: !cardItemId,
      };

      updateCard.mutate(cardUpdated);
      cancelUpdate();
    };

    const handleAddComment = (text: string) => {
      if (!cardId || !cancelUpdate) return;
      if (text.trim().length === 0) return;
      const commentDto: AddCommentDto = {
        cardId,
        cardItemId,
        text,
        boardId,
        socketId,
        isCardGroup: !cardItemId,
        anonymous: isCommentAnonymous,
        columnId: colId,
        fromSocket: false,
      };
      addCommentInCard.mutate(commentDto);
      cancelUpdate();
    };

    const handleUpdateComment = (text: string) => {
      if (!cardId || !cancelUpdate || !commentId) return;
      if (text.trim().length === 0) return;
      const updateCommentDto: UpdateCommentDto = {
        cardId,
        cardItemId,
        text: text.trim(),
        boardId,
        socketId,
        isCardGroup: !cardItemId,
        commentId,
        anonymous: isCommentAnonymous,
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

    if (!isOpen)
      return (
        <Button
          css={{
            mx: '$20',
            display: 'flex',
          }}
          onClick={() => setIsOpen(true)}
        >
          <Icon name="plus" />
          Add new card
        </Button>
      );

    const placeholder = cardText || '';

    return (
      <StyledForm
        {...props}
        align="center"
        direction="column"
        gap="8"
        justify="center"
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
            floatPlaceholder={false}
            // variant={!isEmpty(cardText) ? default : undefined} }
            id="text"
            placeholder={!isDefaultText ? placeholder : 'Write your comment here...'}
          />
          <Flex css={{ width: '100%' }} justify="end">
            {!isCard && (
              <Checkbox
                id={colId + cardId}
                label="Add anonymously"
                size="16"
                checked={anonymous}
                setCheckedTerms={() => {
                  setIsCommentAnonymous(!isCommentAnonymous);
                }}
              />
            )}
            {!isEditing && (
              <Checkbox
                id={colId}
                label="Post anonymously"
                size="16"
                checked={anonymous}
                setCheckedTerms={() => {
                  setIsAnonymous(!isAnonymous);
                }}
              />
            )}
            <Flex gap="8">
              <Button
                css={{ width: '$52', height: '$36' }}
                size="sm"
                variant={!isUpdate && isCard ? 'lightOutline' : 'primaryOutline'}
                onClick={handleClear}
              >
                <Icon name="close" />
              </Button>
              <Button
                css={{ width: '$52', height: '$36' }}
                disabled={disabledButton}
                size="sm"
                type="submit"
                variant="primary"
              >
                <Icon name="check" />
              </Button>
            </Flex>
          </Flex>
        </FormProvider>
      </StyledForm>
    );
  },
);
export default AddCard;
