import TextField from "../../Primitives/TextField";
import Label from "../../Primitives/Label";
import Flex from "../../Primitives/Flex";
import { ItemCompoundFieldSetType } from "../../../types/compoundFieldSet";

const Input: React.FC<ItemCompoundFieldSetType> = (props) => {
  const { label, id, register, ...rest } = props;

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
        {...register()}
        {...rest}
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
