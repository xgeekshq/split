import { useState } from "react";
import { UseFormRegister, FieldError } from "react-hook-form";
import { EyeOpenIcon, EyeNoneIcon, QuestionMarkCircledIcon } from "@modulz/radix-icons";
import {
  HoverCardRoot,
  HoverCardContent,
  HoverCardArrow,
  HoverCardTrigger,
} from "../Primitives/HoverCard";
import TextField from "../Primitives/TextField";
import Fieldset from "../Primitives/Fieldset";
import Label from "../Primitives/Label";
import Text from "../Primitives/Text";
import { User, UserYup } from "../../types/user";
import Flex from "../Primitives/Flex";
import Button from "../Primitives/Button";
import { styled } from "../../stitches.config";
import UnorderedList from "../Primitives/UnorderedList";

const StyledEyeOpenIcon = styled(EyeOpenIcon, { size: "$20" });
const StyledEyeClosedIcon = styled(EyeNoneIcon, { size: "$20" });
const ListItem = styled("li", Text, { fontSize: "$8" });

const CompoundFieldSet: React.FC<{
  label: string;
  id: string;
  inputType: string;
  errors: FieldError | undefined;
  register: UseFormRegister<User>;
}> = ({ label, id, inputType, errors, register }) => {
  const [showPw, setShowPw] = useState(inputType !== "password");

  const hoverCard = id === "password" && errors && (
    <HoverCardRoot>
      <HoverCardTrigger css={{ ml: "$2", pt: "1px" }}>
        <QuestionMarkCircledIcon />
      </HoverCardTrigger>
      <HoverCardContent
        sideOffset={0}
        css={{ border: "solid", borderWidth: "thin", borderColor: "black", p: "$6" }}
      >
        <UnorderedList variant="wOutMargin" css={{ pl: "$20", py: "$8", pr: "$6" }}>
          <ListItem>7 characters</ListItem>
          <ListItem>1 uppercase</ListItem>
          <ListItem>1 lowercase</ListItem>
          <ListItem>1 number</ListItem>
          <ListItem>1 special character</ListItem>
        </UnorderedList>
        <HoverCardArrow css={{ fill: "Black" }} />
      </HoverCardContent>
    </HoverCardRoot>
  );

  const showPasswordButton = inputType === "password" && (
    <Button
      type="button"
      onClick={() => setShowPw(!showPw)}
      css={{
        position: "absolute",
        cursor: "pointer",
        p: "$5",
        right: "80px",
        backgroundColor: "transparent",
      }}
    >
      {!showPw && <StyledEyeOpenIcon />}
      {showPw && <StyledEyeClosedIcon />}
    </Button>
  );

  return (
    <Fieldset css={{ marginBottom: "$16", justifyContent: "center" }}>
      <Flex direction="column" justify="center">
        <TextField
          id={id}
          type={showPw === false ? "password" : "text"}
          placeholder=" "
          size="3"
          backgroundColor="blueLight"
          css={{
            display: "relative",
            pl: "$12",
            pt: "$20",
            "&:focus ~ span": { fontSize: "$12", transform: "translateY(-15px)" },
            "&:not(:placeholder-shown) ~ span": { fontSize: "$12", transform: "translateY(-15px)" },
          }}
          {...register(id as UserYup)}
        />
        <Label
          htmlFor={id}
          size="18"
          color="gray"
          css={{
            pt: "0px",
            position: "absolute",
            pointerEvents: "none",
            pl: "$12",
            transition: "0.5s ease all",
          }}
        >
          {label}
        </Label>
        {showPasswordButton}
      </Flex>
      <Flex align="center" css={{ mt: "$8" }}>
        {errors && <Text color="red">{errors?.message}</Text>}
        {hoverCard}
      </Flex>
    </Fieldset>
  );
};

export default CompoundFieldSet;
