import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { EyeOpenIcon, EyeNoneIcon } from "@modulz/radix-icons";
import TextField from "../../Primitives/TextField";
import Fieldset from "../../Primitives/Fieldset";
import Label from "../../Primitives/Label";
import Text from "../../Primitives/Text";
import { User, UserZod } from "../../../types/user/user";
import Flex from "../../Primitives/Flex";
import Button from "../../Primitives/Button";
import { styled } from "../../../stitches.config";
import AuthFieldSetProps from "../../../types/authFieldSet";
import HoverCard from "./HoverCardFieldSet";

const StyledEyeOpenIcon = styled(EyeOpenIcon, { size: "$20" });
const StyledEyeClosedIcon = styled(EyeNoneIcon, { size: "$20" });
const StyledTextField = styled(TextField, {
  display: "relative",
  "&:focus ~ span": { fontSize: "$12", transform: "translateY(-90%)" },
  "&:not(:placeholder-shown) ~ span": { fontSize: "$12", transform: "translateY(-90%)" },
});
const StyledLabel = styled(Label, {
  pt: "0px",
  position: "absolute",
  pointerEvents: "none",
  pl: "$12",
  transition: "0.5s ease all",
});
const StyledFieldSet = styled(Fieldset, {
  justifyContent: "center",
  height: "auto",
  width: "100%",
});
const StyledButton = styled(Button, {
  position: "absolute",
  cursor: "pointer",
  p: "$5",
  right: "80px",
  backgroundColor: "transparent",
});

const AuthFieldSet: React.FC<AuthFieldSetProps> = ({ label, id, inputType, tabValue }) => {
  const [showPw, setShowPw] = useState(inputType !== "password");

  const handleShowPw = () => {
    setShowPw(!showPw);
  };

  const {
    register,
    formState: { errors },
  } = useFormContext<User>();
  return (
    <StyledFieldSet>
      <Flex direction="column" justify="center" css={{ width: "100%" }}>
        <StyledTextField
          id={id}
          type={showPw === false ? "password" : "text"}
          placeholder=" "
          size="3"
          backgroundColor="blueLight"
          {...register(id as UserZod)}
        />
        <StyledLabel htmlFor={id} size="18" color="gray">
          {label}
        </StyledLabel>
        {inputType === "password" && (
          <StyledButton type="button" onClick={handleShowPw} tabIndex={-1}>
            {!showPw && <StyledEyeOpenIcon />}
            {showPw && <StyledEyeClosedIcon />}
          </StyledButton>
        )}
      </Flex>
      <Flex align="center" css={{ mt: "$8" }}>
        {errors[id as UserZod] && <Text color="red">{errors[id as UserZod]?.message}</Text>}
        {id === "password" && errors[id] && tabValue !== "login" && <HoverCard />}
      </Flex>
    </StyledFieldSet>
  );
};

export default AuthFieldSet;
