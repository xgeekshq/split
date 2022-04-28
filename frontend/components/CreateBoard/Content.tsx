import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { SetterOrUpdater, useRecoilValue } from "recoil";
import ClickEvent from "../../types/events/clickEvent";
import Flex from "../Primitives/Flex";
import { styled } from "../../stitches.config";
import SchemaCreateBoard from "../../schema/schemaCreateBoardForm";
import Button from "../Primitives/Button";
import BoardName from "./BoardName";
import { createBoardDataState } from "../../store/createBoard/atoms/create-board.atom";
import SettingsTabs from "./SettingsTabs";

const StyledForm = styled("form", Flex, {});

const CreateBoardContent: React.FC<{ setOpened: SetterOrUpdater<boolean> }> = ({ setOpened }) => {
  const {
    board: { maxVotes },
  } = useRecoilValue(createBoardDataState);

  const methods = useForm<{ text: string; maxVotes: string }>({
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      text: "Main board -",
      maxVotes: maxVotes ?? "",
    },
    resolver: zodResolver(SchemaCreateBoard),
  });

  const mainBoardName = useWatch({
    control: methods.control,
    name: "text",
  });

  const handleOnClickSaveBoard = (e: ClickEvent<HTMLButtonElement, MouseEvent>) => {
    e?.preventDefault();
    setOpened(false);
  };

  return (
    <StyledForm
      direction="column"
      css={{ width: "100%", height: "100%", backgroundColor: "$background" }}
      onSubmit={methods.handleSubmit(() => {})}
    >
      <Flex
        direction="column"
        css={{
          width: "100%",
          height: "100%",
          pt: "$64",
          pl: "$152",
          pr: "$92",
          overflow: "auto",
        }}
      >
        <FormProvider {...methods}>
          <BoardName mainBoardName={mainBoardName} />
          <SettingsTabs />
        </FormProvider>
      </Flex>
      <Flex justify="end" gap="24" css={{ backgroundColor: "white", py: "$16", pr: "$32" }}>
        <Button variant="lightOutline" onClick={handleOnClickSaveBoard}>
          Cancel
        </Button>
        <Button type="submit">Create board</Button>
      </Flex>
    </StyledForm>
  );
};

export default CreateBoardContent;
