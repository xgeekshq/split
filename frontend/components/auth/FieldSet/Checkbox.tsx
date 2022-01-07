import Label from "../../Primitives/Label";
import Flex from "../../Primitives/Flex";
import { styled } from "../../../stitches.config";
import { CompoundFieldSetType } from "../../../types/compoundFieldSet";

const Input = styled("input", {
  position: "relative",
  mr: "10px",
  width: "14px",
  height: "18px",

  "&:before": {
    content: "",
    position: "absolute",
    display: "block",
    width: "14px",
    height: "14px",
    border: "2px solid black",
    borderRadius: "3px",
    backgroundColor: "white",
  },
  "&:checked:before": {
    backgroundColor: "$accent",
    border: "2px solid $accent",
  },
  "&:checked:after": {
    content: "",
    position: "absolute",
    display: "block",
    width: "3px",
    height: "6px",
    top: "4px",
    left: "6px",
    border: "solid white",
    borderWidth: "0 2px 2px 0",
    "-webkit-transform": "rotate(45deg)",
    "-ms-transform": "rotate(45deg)",
    transform: "rotate(45deg)",
  },

  variants: {
    size: {
      small: {
        width: "14px",
        height: "14px",

        "&:before": {
          width: "10px",
          height: "10px",
        },
        "&:checked:after": {
          width: "2px",
          height: "4px",
          top: "3px",
          left: "5px",
        },
      },
    },
  },
});

type Props = React.ComponentProps<typeof Input> & Pick<CompoundFieldSetType, "id" | "label">;

const Checkbox: React.FC<Props> = ({ label, id, size }) => {
  return (
    <Flex wrap="noWrap" align="center">
      <Input id={id} type="checkbox" size={size} />
      <Label htmlFor={id} size={size === "small" ? "14" : "18"}>
        {label}
      </Label>
    </Flex>
  );
};

export default Checkbox;
