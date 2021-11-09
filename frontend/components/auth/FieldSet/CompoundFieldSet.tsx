import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { EyeOpenIcon, EyeNoneIcon } from "@modulz/radix-icons";
import TextField from "../../Primitives/TextField";
import Fieldset from "../../Primitives/Fieldset";
import Label from "../../Primitives/Label";
import Text from "../../Primitives/Text";
import { User, UserYup } from "../../../types/user";
import Flex from "../../Primitives/Flex";
import Button from "../../Primitives/Button";
import { styled } from "../../../stitches.config";
import { CompoundFieldSetType } from "../../../types/compoundFieldSet";
import HoverCard from "./HoverCardFieldSet";

const StyledEyeOpenIcon = styled(EyeOpenIcon, { size: "$20" });
const StyledEyeClosedIcon = styled(EyeNoneIcon, { size: "$20" });

const CompoundFieldSet: React.FC<CompoundFieldSetType> = ({ label, id, inputType }) => {
  const [showPw, setShowPw] = useState(inputType !== "password");
  const {
    register,
    formState: { errors },
  } = useFormContext<User>();
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
        {inputType === "password" && (
          <Button
            type="button"
            onClick={() => setShowPw(!showPw)}
            tabIndex={-1}
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
        )}
      </Flex>
      <Flex align="center" css={{ mt: "$8" }}>
        {errors[id as UserYup] && <Text color="red">{errors[id as UserYup]?.message}</Text>}
        {id === "password" && errors[id] && <HoverCard />}
      </Flex>
    </Fieldset>
  );
};

export default CompoundFieldSet;
