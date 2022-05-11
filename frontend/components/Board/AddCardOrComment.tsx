import * as z from "zod";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { styled } from "../../stitches.config";
import { CardToAdd } from "../../types/card/card";
import AddCardDto from "../../types/card/addCard.dto";
import Button from "../Primitives/Button";
import Flex from "../Primitives/Flex";
import useCards from "../../hooks/useCards";
import TextArea from "../Primitives/TextArea";
import CrossIcon from "../icons/CrossIcon";
import CheckIcon from "../icons/Check";
import PlusIcon from "../icons/PlusIcon";
import UpdateCardDto from "../../types/card/updateCard.dto";
import useComments from "../../hooks/useComments";
import AddCommentDto from "../../types/comment/addComment.dto";
import UpdateCommentDto from "../../types/comment/updateComment.dto";

const ActionButton = styled(Button, {});

const StyledForm = styled("form", Flex, { width: "100%" });

interface AddCardProps {
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
}

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
    defaultOpen,
  }) => {
    const { addCardInColumn, updateCard } = useCards();
    const { addCommentInCard, updateComment } = useComments();
    const [isOpen, setIsOpen] = useState(!!isUpdate || !!cancelUpdate || defaultOpen);

    const methods = useForm<{ text: string }>({
      mode: "onSubmit",
      reValidateMode: "onChange",
      defaultValues: {
        text: cardText || "",
      },
      resolver: zodResolver(z.object({ text: z.string().min(1) })),
    });

    const handleAddCard = (text: string) => {
      const newCard: CardToAdd = {
        items: [
          {
            text: text.trim(),
            votes: [],
            comments: [],
          },
        ],
        text: text.trim(),
        votes: [],
        comments: [],
      };
      const changes: AddCardDto = {
        colIdToAdd: colId,
        boardId,
        card: newCard,
        socketId,
      };

      addCardInColumn.mutate(changes);
      methods.reset({ text: "" });
    };

    const handleUpdateCard = (text: string) => {
      if (!cardId || !cancelUpdate) return;
      const cardUpdated: UpdateCardDto = {
        cardId,
        cardItemId: cardItemId ?? "",
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
      const commentDto: AddCommentDto = {
        cardId,
        cardItemId,
        text,
        boardId,
        socketId,
        isCardGroup: !cardItemId,
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
        commentId,
      };

      updateComment.mutate(updateCommentDto);
      cancelUpdate();
    };

    const handleClear = () => {
      if ((isUpdate || !isCard) && cancelUpdate) {
        cancelUpdate();
        return;
      }

      methods.reset({ text: "" });
      setIsOpen(false);
    };

    if (!isOpen)
      return (
        <ActionButton css={{ display: "flex" }} onClick={() => setIsOpen(true)}>
          <PlusIcon size="16" css={{ size: "$12", color: "white" }} />
          Add new card
        </ActionButton>
      );

    return (
      <StyledForm
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
          <Flex justify="end" gap="4" css={{ width: "100%" }}>
            <ActionButton
              size="sm"
              css={{ width: "$48", height: "$36" }}
              variant={!isUpdate && isCard ? "lightOutline" : "primaryOutline"}
              onClick={handleClear}
            >
              <CrossIcon size="16" />
            </ActionButton>
            <ActionButton
              css={{ width: "$48", height: "$36" }}
              size="sm"
              type="submit"
              variant="primary"
            >
              <CheckIcon />
            </ActionButton>
          </Flex>
        </FormProvider>
      </StyledForm>
    );
  }
);
export default AddCard;
