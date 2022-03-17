import React, { useCallback, useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import Text from "./Text";
import { styled } from "../../stitches.config";
import Flex from "./Flex";
import isEmpty from "../../utils/isEmpty";
import InfoIcon from "../../public/icons/info.svg";
import EyeIcon from "../../public/icons/eye.svg";

const PlaceholderText = styled(Text, {
  color: "$primary300",
  position: "absolute",
  pointerEvents: "none",
  transformOrigin: "0 0",
  transition: "all .2s ease-in-out",
  p: "$16",
  "&[data-iconposition='left']": {
    pl: "$57",
  },
  "&[data-iconposition='right']": {
    pl: "$17",
  },
});

const IconWrapper = styled(Flex, {
  position: "absolute",
  top: "$16",
  left: "none",
  right: "none",
  cursor: "default",
  "&[data-iconposition='left']": {
    left: "$16",
  },
  "&[data-iconposition='right']": {
    right: "$16",
  },
  "&[data-type='password']": {
    "&:hover": {
      cursor: "pointer",
    },
  },
});

const HelperTextWrapper = styled(Flex, {
  mt: "$8",
  "& svg": {
    height: "$16 !important",
    width: "$16 !important",
    color: "$dangerBase",
  },
});

const StyledInput = styled("input", {
  // Reset
  appearance: "none",
  borderWidth: "0",
  boxSizing: "border-box",
  margin: "0",
  outlineOffset: "0",
  padding: "0",
  fontFamily: "$body",
  WebkitTapHighlightColor: "rgba(0,0,0,0)",
  backgroundColor: "$white",
  "&::before": {
    boxSizing: "border-box",
  },
  "&::after": {
    boxSizing: "border-box",
  },
  "&:-internal-autofill-selected": {
    backgroundColor: "$white",
  },

  "&:-webkit-autofill,&:-webkit-autofill:active,&:-webkit-autofill:focus": {
    "-webkit-box-shadow": "0 0 0px 1000px white inset, 0px 0px 0px 2px $colors$successLightest",
  },

  "&:-webkit-autofill::first-line": {
    color: "$dangerBase",
    fontFamily: "$body",
    fontSize: "$16",
  },

  ":-internal-autofill-previewed": {
    fontFamily: "$body",
    fontSize: "$16",
  },

  // Custom

  display: "flex",
  fontSize: "$16",
  px: "$16",
  boxShadow: "0",
  border: "1px solid $primary200",
  outline: "none",
  width: "100%",
  borderRadius: "$4",
  lineHeight: "$20",
  height: "$56",
  pt: "$28",
  pb: "$8",
  "&::-webkit-input-placeholder": {
    fontSize: "22px !important",
    color: "$primary300",
  },
  "&:disabled": {
    backgroundColor: "$primary50",
  },
  variants: {
    variant: {
      default: {
        "&:focus": {
          borderColor: "$primary400",
          boxShadow: "0px 0px 0px 2px $colors$primaryLightest",
        },
        "&:-webkit-autofill": {
          "-webkit-box-shadow":
            "0 0 0px 1000px white inset, 0px 0px 0px 2px $colors$primaryLightest",
        },
      },
      valid: {
        borderColor: "$success700",
        boxShadow: "0px 0px 0px 2px $colors$successLightest",
        "&:-webkit-autofill": {
          "-webkit-box-shadow":
            "0 0 0px 1000px white inset, 0px 0px 0px 2px $colors$successLightest",
        },
      },
      error: {
        borderColor: "$danger700",
        boxShadow: "0px 0px 0px 2px $colors$dangerLightest",
        "&:-webkit-autofill": {
          "-webkit-box-shadow":
            "0 0 0px 1000px white inset, 0px 0px 0px 2px $colors$dangerLightest",
        },
      },
    },
  },
  color: "$primaryBase",
  "&::placeholder": {
    "&:disabled": {
      color: "$primaryBase",
    },
    color: "$primary300",
  },
  "&:not(:placeholder-shown) ~ label": {
    transform: `scale(0.875) translateX(0.1rem) translateY(-0.5rem)`,
  },
  "&:focus ~ label": {
    transform: `scale(0.875) translateX(0.1rem) translateY(-0.5rem)`,
  },

  "&[data-iconposition='left']": {
    pl: "$56",
    "&:not(:placeholder-shown) ~ label": {
      transform: `scale(0.875) translateX(0.5rem) translateY(-0.5rem)`,
    },
    "&:focus ~ label": {
      transform: `scale(0.875) translateX(0.5rem) translateY(-0.5rem)`,
    },
  },

  "&[data-iconposition='right']": {
    pr: "$56",
  },
});

type StyledInpupProps = React.ComponentProps<typeof StyledInput>;

interface InputProps extends StyledInpupProps {
  id: string;
  state?: "default" | "error" | "valid";
  type: "text" | "password" | "email" | "number";
  placeholder: string;
  icon?: "eye";
  helperText?: string;
  iconPosition?: "left" | "right";
  disabled?: boolean;
  clearErrorCode?: () => void;
}

const Input: React.FC<InputProps> = ({
  id,
  placeholder,
  state,
  icon,
  iconPosition,
  helperText,
  type,
  disabled,
  css,
  clearErrorCode,
}) => {
  Input.defaultProps = {
    state: undefined,
    iconPosition: undefined,
    icon: undefined,
    helperText: "",
    disabled: false,
    clearErrorCode: undefined,
  };
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [currentType, setType] = useState(type);

  const {
    register,
    getValues,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  const { ref, ...rest } = register(id);

  const message = errors[id]?.message;
  const isValueEmpty = isEmpty(getValues()[id]);

  const getState = useCallback(() => {
    if (message) {
      return "error";
    }
    if (isValueEmpty) {
      return "default";
    }
    return "valid";
  }, [message, isValueEmpty]);

  const autoState = getState();
  const currentState = state ?? autoState;

  const isHelperEmpty = isEmpty(helperText) && isEmpty(message);

  const handleOnClickIcon = () => {
    if (type === "text") return;
    setType(currentType === "password" ? "text" : "password");
  };

  useEffect(() => {
    if (id === "password") inputRef.current?.focus();
    setTimeout(() => {
      if (id === "email") inputRef.current?.focus();
    }, 80);
  }, []);

  return (
    <Flex
      direction="column"
      css={{ position: "relative", width: "100%", mb: "$16", height: "auto", ...css }}
      onBlur={() => {
        if (isValueEmpty) {
          clearErrors();
        }
      }}
    >
      {!!icon && (
        <IconWrapper data-iconposition={iconPosition} data-type={type} onClick={handleOnClickIcon}>
          {icon === "eye" && <EyeIcon />}
        </IconWrapper>
      )}
      <Flex>
        <StyledInput
          {...rest}
          ref={(e) => {
            ref(e);
            inputRef.current = e;
          }}
          id={id}
          placeholder=" "
          disabled={disabled}
          type={currentType}
          variant={currentState}
          data-state={currentState}
          autoComplete="off"
          onFocus={clearErrorCode}
          data-iconposition={iconPosition}
        />
        <PlaceholderText as="label" htmlFor={id} data-iconposition={iconPosition}>
          {placeholder}
        </PlaceholderText>
      </Flex>

      {!isHelperEmpty && (
        <HelperTextWrapper gap="4" align="center">
          {currentState === "error" && <InfoIcon />}
          <Text
            css={{
              color: currentState === "error" ? "$dangerBase" : "$primary300",
            }}
            hint
          >
            {!isEmpty(helperText) ? helperText : message}
          </Text>
        </HelperTextWrapper>
      )}
    </Flex>
  );
};

export default Input;
