import React, { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import Button from '@/components/Primitives/Button';
import Checkbox from '@/components/Primitives/Checkbox';
import Flex from '@/components/Primitives/Layout/Flex';
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
import { CARD_TEXT_DEFAULT } from '@/utils/constants';
import Icon from '../Primitives/Icon';

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
  cardTextDefault?: string;
  commentId?: string;
  cancelUpdate?: () => void;
  defaultOpen?: boolean;
  isEditing?: boolean;
  anonymous?: boolean;
  isDefaultText: boolean;
  postAnonymously: boolean;
  isOwner?: boolean;
  columnName?: string;
  isRegularBoard?: boolean;
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
    cardTextDefault,
    isDefaultText,
    cancelUpdate,
    isCard,
    commentId,
    isEditing = false,
    defaultOpen,
    anonymous,
    postAnonymously,
    isOwner,
    columnName,
    isRegularBoard,
    ...props
  }) => {
    const { addCardInColumn, updateCard } = useCards();
    const { addCommentInCard, updateComment } = useComments();
    const [isOpen, setIsOpen] = useState(!!isUpdate || !!cancelUpdate || defaultOpen);
    const [isAnonymous, setIsAnonymous] = useState(anonymous ?? postAnonymously ?? false);
    const [isCommentAnonymous, setIsCommentAnonymous] = useState(
      anonymous ?? postAnonymously ?? false,
    );
    const placeholder = cardTextDefault || '';

    const textAreaText = useMemo(() => {
      if (isDefaultText && !cardText && columnName === 'To improve' && !isRegularBoard) {
        return cardTextDefault;
      }
      if (isDefaultText && !cardText) {
        return '';
      }
      if (!isDefaultText && !cardText) {
        return cardTextDefault;
      }

      return cardText;
    }, [cardText, cardTextDefault, columnName, isDefaultText, isRegularBoard]);

    const placeholderToDisplay = useMemo(() => {
      if (isDefaultText && !cardText) {
        return CARD_TEXT_DEFAULT;
      }
      if (!isDefaultText && !cardText) {
        return placeholder;
      }

      return cardText ?? '';
    }, [cardText, isDefaultText, placeholder]);

    const methods = useForm<{ text: string }>({
      mode: 'onChange',
      reValidateMode: 'onChange',
      defaultValues: {
        text: textAreaText,
      },
      values: {
        text: textAreaText || '',
      },
      resolver: joiResolver(SchemaAddCommentForm),
    });

    const watchCardTextInput = methods.watch();

    // allows the use of the template
    const placeholderColor =
      watchCardTextInput.text !== CARD_TEXT_DEFAULT && watchCardTextInput.text === placeholder
        ? '$primary300'
        : '$primaryBase';

    const disabledButton =
      watchCardTextInput.text?.trim().length === 0 ||
      watchCardTextInput.text.trim() === placeholder;

    const handleClear = () => {
      if ((isUpdate || !isCard) && cancelUpdate) {
        cancelUpdate();
        return;
      }

      methods.reset({ text: textAreaText });
      setIsOpen(false);
    };

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
      handleClear();
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

    useEffect(() => {
      setIsAnonymous(anonymous ?? postAnonymously ?? false);
      setIsCommentAnonymous(anonymous ?? postAnonymously ?? false);
    }, [anonymous, postAnonymously]);

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
          <TextArea id="text" placeholder={placeholderToDisplay} textColor={placeholderColor} />
          <Flex css={{ width: '100%' }} justify="between">
            {!isCard && (isOwner || !commentId) && (
              // This is when you are editing a card / comment
              <Checkbox
                id={[colId, cardId, commentId].join('_')}
                label="Post anonymously"
                size="md"
                checked={isCommentAnonymous}
                handleChange={() => {
                  setIsCommentAnonymous(!isCommentAnonymous);
                }}
              />
            )}
            {!isEditing && (
              // This is when you are Creating a new Card
              <Checkbox
                id={colId}
                label="Post anonymously"
                size="md"
                checked={isAnonymous}
                handleChange={() => {
                  setIsAnonymous(!isAnonymous);
                }}
              />
            )}
            <Flex gap="8" css={{ flex: '1' }} justify="end">
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
