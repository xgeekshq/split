import { useRouter } from "next/router";
import { useContext, useState, useEffect } from "react";
import { Cross2Icon, CheckIcon } from "@modulz/radix-icons";
import { styled } from "../../stitches.config";
import TitleContext from "../../store/title-context";
import Flex from "../Primitives/Flex";
import Text from "../Primitives/Text";
import TextField from "../Primitives/TextField";

const Container = styled(Flex);

const Title: React.FC = () => {
  const router = useRouter();
  const titleCtx = useContext(TitleContext);
  const isBoardPage = router.pathname.startsWith("/boards/");

  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(titleCtx.title);

  useEffect(() => {
    setNewTitle(titleCtx.title);
  }, [titleCtx.title]);

  const saveTitle = () => {
    titleCtx.setTitle(newTitle);
    setEditing(false);
  };

  const pageTitle = (
    <Text fontWeight="semiBold" size="xl">
      {titleCtx.title}
    </Text>
  );
  const titleBoard = (
    <Container align="center" wrap="noWrap">
      <TextField
        type="text"
        onClick={() => setEditing(true)}
        value={newTitle}
        onChange={(event) => setNewTitle(event.target.value)}
        variant="ghost"
        tabIndex={0}
      />
      {editing && (
        <Container wrap="noWrap">
          <CheckIcon onClick={() => saveTitle()} />
          <Cross2Icon onClick={() => setEditing(false)} />
        </Container>
      )}
    </Container>
  );

  return (
    <>
      {!isBoardPage && pageTitle}
      {isBoardPage && titleBoard}
    </>
  );
};

export default Title;
