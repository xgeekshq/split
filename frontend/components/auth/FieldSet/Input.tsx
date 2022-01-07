import TextField from "../../Primitives/TextField";
import Label from "../../Primitives/Label";
import { UserYup } from "../../../types/user";
import { ItemCompoundFieldSetType } from "../../../types/compoundFieldSet";
import Flex from "../../Primitives/Flex";

const Input: React.FC<ItemCompoundFieldSetType> = ({ label, id, register }) => {
  return (
    <Flex direction="column" justify="center">
      <TextField
        id={id}
        type="text"
        placeholder=" "
        size="3"
        css={{
          p: "$16",
          "&:focus ~ span": { fontSize: "$14", transform: "translateY(-1.7rem)", color: "$accent" },
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
    </Flex>
  );
};

export default Input;
