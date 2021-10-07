import { useRouter } from "next/router";
import { useState } from "react";
import { Cross2Icon, CheckIcon } from "@modulz/radix-icons";
import { styled } from "../../stitches.config";
import { useStoreContext } from "../../store/store-context";
import Flex from "../Primitives/Flex";
import Text from "../Primitives/Text";
import TextField from "../Primitives/TextField";

const Container = styled(Flex);

const Title: React.FC = () => {
  const router = useRouter();
  const {
    state: { title },
    dispatch,
  } = useStoreContext();
  const isBoardPage = router.pathname.startsWith("/boards/");

  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const saveTitle = () => {
    dispatch({ type: "setTitle", val: newTitle });
    setEditing(false);
  };

  // useEffect(() => {
  //   dispatch({ type: "setTitle", val: title });
  // }, [title, dispatch]);

  const pageTitle = (
    <Text fontWeight="semiBold" size="xl">
      {title}
    </Text>
  );
  const titleBoard = (
    <Container align="center" wrap="noWrap">
      <TextField
        type="text"
        onClick={() => setEditing(true)}
        value={title}
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
