import { useEffect, useMemo, useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

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
  '&:focus': {
    color: '$primaryBase',
  },
  '&::-webkit-input-placeholder': {
    color: '$primary300',
  },
  fontFamily: 'DM Sans',
  variants: {
    variant: {
      default: {
        '&:focus': {
          borderColor: '$primary400',
          boxShadow: '0px 0px 0px 2px $colors$primaryLightest',
        },
      },
      valid: {
        borderColor: '$success700',
        boxShadow: '0px 0px 0px 2px $colors$successLightest',
      },
      error: {
        borderColor: '$danger700',
        boxShadow: '0px 0px 0px 2px $colors$dangerLightest',
      },
    },
  },
});

interface TextAreaProps {
  id: string;
  placeholder: string;
  disabled?: boolean;
  textColor?: '$primaryBase' | '$primary300';
}

const TextArea = ({
  id,
  placeholder,
  disabled = false,
  textColor = '$primaryBase',
}: TextAreaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  function textAreaAdjust(element: HTMLTextAreaElement | null) {
    if (!element) return;
    element.style.height = '1px';
    element.style.height = `${25 + element.scrollHeight}px`;
  }

  const {
    getValues,
    control,
    formState: { errors, dirtyFields },
  } = useFormContext();

  const currentValue = getValues()[id];
  const isValueEmpty = isEmpty(currentValue);

  const getCurrentState = useMemo(() => {
    if (errors[id]) return 'error';
    if (!dirtyFields[id]) return 'default';
    if (!isValueEmpty) return 'valid';

    return 'default';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirtyFields[id], errors[id], id, isValueEmpty]);

  useEffect(() => {
    textAreaAdjust(textareaRef.current);
  }, [currentValue]);

  return (
    <Controller
      control={control}
      defaultValue={placeholder}
      name={id}
      render={({ field: { onChange, value, ref } }) => (
        <StyledTextArea
          disabled={disabled}
          id={id}
          onChange={onChange}
          placeholder={placeholder}
          value={value}
          variant={getCurrentState}
          css={{
            minHeight: '$80',
            backgroundColor: '$primary50',
            py: '$12',
            px: '$16',
            color: textColor,
          }}
          ref={(e) => {
            if (ref) ref(e);
            textareaRef.current = e;
          }}
        />
      )}
    />
  );
};
export default TextArea;
