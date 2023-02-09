import { useEffect, useMemo, useRef } from 'react';
import { useFormContext } from 'react-hook-form';

import { styled } from '@/styles/stitches/stitches.config';
import isEmpty from '@/utils/isEmpty';

const StyledTextArea = styled('textarea', {
  // Reset
  appearance: 'none',
  borderWidth: '0',
  boxSizing: 'border-box',
  margin: '0',
  outlineOffset: '0',
  padding: '0',
  WebkitTapHighlightColor: 'rgba(0,0,0,0)',
  '&::before': {
    boxSizing: 'border-box',
  },
  '&::after': {
    boxSizing: 'border-box',
  },

  // Custom
  fontSize: '$16',
  lineHeight: '$20',
  resize: 'none',
  height: 'auto',
  boxShadow: '0',
  border: '1px solid $primary200',
  borderRadius: '$4',
  outline: 'none',
  fontWeight: 'normal',
  whiteSpace: 'pre-line',
  width: '100%',
  pt: '$28',
  pb: '$8',
  pl: '$16',
  pr: '$16',
  '&:focus ~ label': {
    transform: `scale(0.875) translateX(0.115rem) translateY(-0.5rem)`,
  },
  '&:not(:placeholder-shown) ~ label': {
    transform: `scale(0.875) translateX(0.115rem) translateY(-0.5rem)`,
  },
  overflowWrap: 'break-word',
  overflow: 'hidden',
  '&:disabled': {
    backgroundColor: '$primary50',
  },
  color: '$primaryBase',
  '&::-webkit-input-placeholder': {
    color: '$primary300',
  },
  fontFamily: 'DM Sans',
  variants: {
    variant: {
      default: {
        '&:focus': {
          borderColor: '$primary400',
          boxShadow: '0px 0px 0px 2px $colors$primaryLightest)',
        },
      },
      valid: {
        borderColor: '$success700',
        boxShadow: '0px 0px 0px 2px $colors$successLightest)',
      },
      error: {
        borderColor: '$danger700',
        boxShadow: '0px 0px 0px 2px $colors$dangerLightest)',
      },
    },
  },
});

interface ResizableTextAreaProps {
  id: string;
  placeholder: string;
  disabled?: boolean;
}

const TextArea: React.FC<ResizableTextAreaProps> = ({ id, placeholder, disabled }) => {
  TextArea.defaultProps = {
    disabled: false,
  };

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  function textAreaAdjust(element: HTMLTextAreaElement | null) {
    if (!element) return;
    element.style.height = '1px';
    element.style.height = `${25 + element.scrollHeight}px`;
  }

  const {
    register,
    getValues,
    formState: { errors, touchedFields },
  } = useFormContext();
  const { ref, ...rest } = register(id);

  const message = errors[id]?.message;
  const value = getValues()[id];
  const isValueEmpty = isEmpty(value);

  const autoState = useMemo(() => {
    if (message) return 'error';
    if (isValueEmpty || (value && !touchedFields.text)) return 'default';
    return 'valid';
  }, [message, isValueEmpty, value, touchedFields.text]);

  const currentState = useMemo(() => {
    if (disabled && !touchedFields[id]) return 'default';
    return autoState;
  }, [autoState, disabled, id, touchedFields]);

  useEffect(() => {
    textAreaAdjust(textareaRef.current);
  }, [value]);

  return (
    <StyledTextArea
      {...rest}
      css={{ minHeight: '$80', backgroundColor: '$primary50', py: '$12', px: '$16' }}
      disabled={disabled}
      id={id}
      placeholder={placeholder}
      variant={currentState}
      ref={(e) => {
        if (ref) ref(e);
        textareaRef.current = e;
      }}
    />
  );
};
export default TextArea;
