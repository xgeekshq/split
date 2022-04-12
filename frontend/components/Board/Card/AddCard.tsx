import { Cross2Icon, CheckIcon } from "@modulz/radix-icons";
import React, { useState } from "react";
import { styled } from "../../../stitches.config";
import { CardToAdd } from "../../../types/card/card";
import ToastMessage from "../../../utils/toast";
import AddCardDto from "../../../types/card/addCard.dto";
import BlurEvent from "../../../types/events/blurEvent";
import Button from "../../Primitives/Button";
import Flex from "../../Primitives/Flex";
import isEmpty from "../../../utils/isEmpty";
import useCards from "../../../hooks/useCards";

const ActionButton = styled(Button, { borderRadius: "$round" });

const StyledCrossIcon = styled(Cross2Icon, { size: "$20" });
const StyledCheckIcon = styled(CheckIcon, { size: "$20" });

interface AddCardProps {
  colId: string;
  boardId: string;
  socketId: string;
}

const AddCard = React.memo<AddCardProps>(({ colId, boardId, socketId }) => {
  const { addCardInColumn } = useCards();

  const [text, setText] = useState<string>("");
  const [isClicked, setIsClicked] = useState(false);

  const handleDisableEdit = () => {
    setText("");
    setIsClicked(false);
  };

  const handleBlur = (e: BlurEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsClicked(false);
    }
  };

  const handleFocus = () => setIsClicked(true);

  const handleAddCard = () => {
    if (isEmpty(text)) {
      ToastMessage("Card text cannot be empty!", "error");
      return;
    }
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
    handleDisableEdit();
  };

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      gap="4"
      css={{
        width: "100%",
      }}
      tabIndex={0}
      onBlur={handleBlur}
      onFocus={handleFocus}
    >
      {/* <TextArea  /> */}
      {isClicked && (
        <Flex justify="end" gap="4" css={{ width: "100%" }}>
          <ActionButton color="red" onClick={handleDisableEdit}>
            <StyledCrossIcon />
          </ActionButton>
          <ActionButton color="green" onClick={handleAddCard}>
            <StyledCheckIcon />
          </ActionButton>
        </Flex>
      )}
    </Flex>
  );
});
export default AddCard;
