import { useState } from "react";
import { EyeOpenIcon, EyeNoneIcon } from "@modulz/radix-icons";
import TextField from "../../Primitives/TextField";
import Label from "../../Primitives/Label";
import { UserYup } from "../../../types/user";
import Button from "../../Primitives/Button";
import { styled } from "../../../stitches.config";
import { FormCompoundFieldSetType } from "../../../types/compoundFieldSet";
import Flex from "../../Primitives/Flex";

const StyledEyeOpenIcon = styled(EyeOpenIcon, { size: "$20" });
const StyledEyeClosedIcon = styled(EyeNoneIcon, { size: "$20" });

const InputPassword: React.FC<FormCompoundFieldSetType> = ({ label, id, register }) => {
  const [showPw, setShowPw] = useState(false);

  return (
    <Flex direction="column" justify="center" css={{ position: "relative" }}>
      <TextField
        id={id}
        type={showPw ? "text" : "password"}
        placeholder=" "
        size="3"
        css={{
          p: "$16",
          "&:focus ~ span": { fontSize: "$14", transform: "translateY(-1.7rem)" },
          "&:not(:placeholder-shown) ~ span": {
            fontSize: "$14",
            transform: "translateY(-1.7rem)",
          },
        }}
        {...register(id as UserYup)}
      />
      <Label
        htmlFor={id}
        size="18"
        css={{
          backgroundColor: "white",
          position: "absolute",
          pointerEvents: "none",
          ml: "$10",
          pl: "$4",
          pt: "0px",
          pr: "$4",
          transition: "0.5s ease all",
        }}
      >
        {label}
      </Label>
      <Button
        type="button"
        onClick={() => setShowPw(!showPw)}
        tabIndex={-1}
        css={{
          position: "absolute",
          cursor: "pointer",
          p: "$5",
          right: "$10",
          backgroundColor: "transparent",
        }}
      >
        {showPw ? <StyledEyeClosedIcon /> : <StyledEyeOpenIcon />}
      </Button>
    </Flex>
  );
};

export default InputPassword;
