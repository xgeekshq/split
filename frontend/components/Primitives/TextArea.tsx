import { useMemo, useRef } from "react";
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
  variants: {
    variant: {
      default: {
        "&:focus": {
          borderColor: "$primary400",
          boxShadow: "0px 0px 0px 2px $colors$primaryLightest)",
        },
      },
      valid: {
        borderColor: "$success700",
        boxShadow: "0px 0px 0px 2px $colors$successLightest)",
      },
      error: {
        borderColor: "$danger700",
        boxShadow: "0px 0px 0px 2px $colors$dangerLightest)",
      },
    },
  },
});

interface ResizableTextAreaProps {
  id: string;
  placeholder: string;
  helperText?: string;
  disabled?: boolean;
  floatPlaceholder?: boolean;
}

const TextArea: React.FC<ResizableTextAreaProps> = ({
  id,
  placeholder,
  helperText,
  disabled,
  floatPlaceholder,
}) => {
  TextArea.defaultProps = {
    helperText: undefined,
    disabled: false,
  };

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const flexRef = useRef<HTMLDivElement | null>(null);

  const {
    register,
    getValues,
    formState: { errors, touchedFields },
  } = useFormContext();
  const { ref, ...rest } = register(id);

  const message = errors[id]?.message;
  const value = getValues()[id];
  const isValueEmpty = isEmpty(value);

  // useEffect(() => {
  //   if (textareaRef && textareaRef.current) {
  //     textareaRef.current.value = value;
  //     textareaRef.current.style.height = "0px";
  //     const { scrollHeight } = textareaRef.current;
  //     textareaRef.current.style.height = `${scrollHeight === 42 ? 0 : scrollHeight}px`;
  //   }
  // }, [value]);

  const autoState = useMemo(() => {
    if (message) return "error";
    if (isValueEmpty || (value && !touchedFields.text)) return "default";
    return "valid";
  }, [message, isValueEmpty, value, touchedFields.text]);

  const currentState = useMemo(() => {
    if (disabled && !touchedFields[id]) return "default";
    return autoState;
  }, [autoState, disabled, id, touchedFields]);

  return (
    <Flex
      ref={flexRef}
      direction="column"
      css={{ position: "relative", width: "100%", height: "auto", zIndex: 1 }}
    >
      <Flex>
        {floatPlaceholder && (
          <Flex>
            <StyledTextArea
              {...rest}
              id={id}
              placeholder=" "
              disabled={disabled}
              variant={currentState}
              ref={(e) => {
                if (ref) ref(e);
                textareaRef.current = e;
              }}
              css={{
                pt: "$28",
                pb: "$8",
                pl: "$16",
                pr: "$16",
                "&:focus ~ label": {
                  transform: `scale(0.875) translateX(0.115rem) translateY(-0.5rem)`,
                },
                "&:not(:placeholder-shown) ~ label": {
                  transform: `scale(0.875) translateX(0.115rem) translateY(-0.5rem)`,
                },
                overflowWrap: "break-word",
                overflow: "hidden",
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
        )}
      </Flex>
      <StyledTextArea
        {...rest}
        id={id}
        placeholder={placeholder}
        disabled={disabled}
        variant={currentState}
        ref={(e) => {
          if (ref) ref(e);
          textareaRef.current = e;
        }}
        css={{ minHeight: "$80", backgroundColor: "$primary50", py: "$12", px: "$16" }}
      />
      {floatPlaceholder && (
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
          {currentState === "error" && <InfoIcon size="24" />}
          <Text
            css={{
              color: currentState === "error" ? "$dangerBase" : "$primary300",
            }}
            hint
          >
            {!isEmpty(helperText) ? helperText : errors[`${id}`]?.message}
          </Text>
        </Flex>
      )}
    </Flex>
  );
};
export default TextArea;
