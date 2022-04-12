import { useEffect, useMemo, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { styled } from "../../stitches.config";
import isEmpty from "../../utils/isEmpty";
import Flex from "./Flex";
import Text from "./Text";
import InfoIcon from "../icons/Info";

const StyledTextArea = styled("textarea", {
  // Reset
  appearance: "none",
  borderWidth: "0",
  boxSizing: "border-box",
  margin: "0",
  outlineOffset: "0",
  padding: "0",
  WebkitTapHighlightColor: "rgba(0,0,0,0)",
  "&::before": {
    boxSizing: "border-box",
  },
  "&::after": {
    boxSizing: "border-box",
  },

  // Custom

  fontSize: "$16",
  lineHeight: "$20",
  resize: "none",
  height: "auto",
  px: "$16",
  py: "$16",
  boxShadow: "0",
  border: "1px solid $primary200",
  borderRadius: "$4",
  outline: "none",
  fontWeight: "normal",
  width: "100%",
  "&:disabled": {
    backgroundColor: "$primary50",
  },
  color: "$primaryBase",
  "&::-webkit-input-placeholder": {
    color: "$primary300",
  },
  fontFamily: "DM Sans",
  overflowWrap: "break-word",
  overflow: "hidden",
  pt: "$28",
  pb: "$8",
  pl: "$16",
  pr: "$16",
  variants: {
    variant: {
      default: {
        "&:focus": {
          borderColor: "$primary400",
          boxShadow: "0px 0px 0px 2px var(--colors-primaryLightest)",
        },
      },
      valid: {
        borderColor: "$success700",
        boxShadow: "0px 0px 0px 2px var(--colors-successLightest)",
      },
      error: {
        borderColor: "$danger700",
        boxShadow: "0px 0px 0px 2px var(--colors-dangerLightest)",
      },
    },
  },
});

interface ResizableTextAreaProps {
  id: string;
  placeholder: string;
  helperText?: string;
  disabled?: boolean;
}

const TextArea: React.FC<ResizableTextAreaProps> = ({ id, placeholder, helperText, disabled }) => {
  TextArea.defaultProps = {
    helperText: undefined,
    disabled: false,
  };

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const flexRef = useRef<HTMLDivElement | null>(null);

  const values = useFormContext();
  const { ref, ...rest } = values.register(id);
  const {
    formState: { errors },
  } = values;
  const value = values?.getValues()[id];

  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.value = value;
      textareaRef.current.style.height = "0px";
      const { scrollHeight } = textareaRef.current;
      textareaRef.current.style.height = `${scrollHeight === 42 ? 0 : scrollHeight}px`;
    }
  }, [value]);

  const isValueEmpty = isEmpty(value);

  const state = useMemo(() => {
    if (errors[id]) {
      return "error";
    }
    if (isValueEmpty) {
      return "default";
    }
    return "valid";
  }, [errors, id, isValueEmpty]);

  return (
    <Flex
      ref={flexRef}
      direction="column"
      css={{ position: "relative", width: "100%", height: "auto", mb: "$20" }}
    >
      <Flex>
        <StyledTextArea
          {...rest}
          id={id}
          placeholder=" "
          disabled={disabled}
          variant={state}
          ref={(e) => {
            if (ref) ref(e);
            textareaRef.current = e;
          }}
          css={{
            "&:focus ~ label": {
              transform: `scale(0.875) translateX(0.115rem) translateY(-0.5rem)`,
            },
            "&:not(:placeholder-shown) ~ label": {
              transform: `scale(0.875) translateX(0.115rem) translateY(-0.5rem)`,
            },
          }}
        />
        <Text
          as="label"
          htmlFor={id}
          css={{
            fontSize: "$16",
            top: "0",
            p: "$16",
            pl: "$17",
            lineHeight: "24px",
            color: "$primary300",
            position: "absolute",
            pointerEvents: "none",
            transformOrigin: "0 0",
            transition: "all .2s ease-in-out",
          }}
        >
          {placeholder}
        </Text>
      </Flex>
      <Flex
        gap="4"
        align="center"
        css={{
          mt: "$8",
          "& svg": {
            height: "$16 !important",
            width: "$16 !important",
            color: "$dangerBase",
          },
        }}
      >
        {state === "error" && <InfoIcon />}
        <Text
          css={{
            color: state === "error" ? "$dangerBase" : "$primary300",
          }}
          hint
        >
          {!isEmpty(helperText) ? helperText : errors[`${id}`]?.message}
        </Text>
      </Flex>
    </Flex>
  );
};
export default TextArea;
