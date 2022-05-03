import React, { useState } from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { styled } from "@stitches/react";
import CheckIcon from "../icons/Check";
import Text from "./Text";
import Flex from "./Flex";
import IndeterminateIcon from "../icons/Indeterminate";

const StyledCheckbox = styled(CheckboxPrimitive.Root, {
  all: "unset",
  backgroundColor: "white",
  boxSizing: "box-sizing",
  borderRadius: "$2",
  border: "1px solid $primaryBase",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  variants: {
    variant: {
      default: {
        borderColor: "$primaryBase",
        backgroundColor: "transparent",
        '&[data-state="checked"]': {
          backgroundColor: "$primaryBase",
        },
        "&:disabled": {
          borderColor: "$primary100",
          '&[data-state="checked"]': {
            backgroundColor: "$primary100",
          },
        },
      },
      error: {
        borderColor: "$dangerBase",
        '&[data-state="checked"]': {
          backgroundColor: "$dangerBase",
        },
        "&:disabled": {
          borderColor: "$primary100",
          '&[data-state="checked"]': {
            backgroundColor: "$primary100",
          },
        },
      },
    },
  },
  '&[data-state="indeterminate"]': {
    borderColor: "$primaryBase",
    backgroundColor: "$primaryBase",
  },
  defaultVariants: {
    variant: "default",
  },
});

const StyledIndicator = styled(CheckboxPrimitive.Indicator, {
  color: "$white",
});

// Exports
export const CheckboxIndicator = StyledIndicator;

const getIndeterminateSize = (boxSize: "12" | "14" | "16") => {
  if (boxSize === "12") return "8";
  return "10";
};

const Checkbox: React.FC<{
  label: string;
  id: string;
  variant?: "default" | "error";
  checked?: boolean | "indeterminate";
  disabled?: boolean;
  size: "12" | "14" | "16";
  handleChange?: (value: string) => void;
}> = ({ id, label, variant, size, checked, disabled, handleChange }) => {
  Checkbox.defaultProps = {
    variant: "default",
    checked: false,
    disabled: false,
    handleChange: () => {},
  };

  const [currentCheckValue, setCurrentCheckValue] = useState<boolean | undefined | "indeterminate">(
    checked
  );

  const handleCheckedChange = (isChecked: boolean | "indeterminate") => {
    if (handleChange) handleChange(id);
    setCurrentCheckValue(isChecked);
  };

  return (
    <Flex css={{ alignItems: "center", height: "$36", width: "100%", boxSizing: "border-box" }}>
      <Flex>
        <StyledCheckbox
          variant={variant ?? "default"}
          name={id}
          id={id}
          checked={currentCheckValue}
          disabled={disabled}
          onCheckedChange={handleCheckedChange}
          css={{ width: `$${size} !important`, height: `$${size} !important` }}
        >
          <CheckboxIndicator
            css={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "& svg": {
                width:
                  currentCheckValue === "indeterminate"
                    ? `$${getIndeterminateSize(size)} !important`
                    : `$${size} !important`,
                height: `$${size} !important`,
              },
            }}
          >
            {currentCheckValue === true && <CheckIcon />}
            {currentCheckValue === "indeterminate" && <IndeterminateIcon />}
          </CheckboxIndicator>
        </StyledCheckbox>
      </Flex>
      <Text as="label" size="sm" css={{ paddingLeft: "$8", width: "100%" }} htmlFor={id}>
        {label}
      </Text>
    </Flex>
  );
};

export default Checkbox;
