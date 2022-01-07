import { ItemCompoundFieldSetType } from "../../../types/compoundFieldSet";
import { useState } from "react";
import { styled } from "../../../stitches.config";

const Label = styled("label", {
  position: "relative",
  display: "inline-block",
  width: "32px",
  height: "18px",

  "> input": {
    opacity: 0,
    width: 0,
    height: 0,
  },

  "> span": {
    position: "absolute",
    cursor: "pointer",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    "background-color": "#7A8B9C",
    "-webkit-transition": ".4s",
    transition: ".4s",
    "border-radius": "34px",
  },

  "> span:before": {
    position: "absolute",
    content: "",
    height: "14px",
    width: "14px",
    left: "2px",
    top: "2px",
    "background-color": "white",
    "-webkit-transition": ".4s",
    transition: ".4s",
    "border-radius": "50%",
  },

  "> input:checked + span": {
    "background-color": "$accent",
  },

  "> input:checked + span:before": {
    transform: "translateX(14px)",
  },
});

const Switch: React.FC<ItemCompoundFieldSetType> = ({}) => {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <Label>
      <input type="checkbox" checked={isChecked} onClick={() => setIsChecked(!isChecked)} />
      <span className="slider round"></span>
    </Label>
  );
};

export default Switch;
