import { useMemo, useRef } from 'react';
import { useFormContext } from 'react-hook-form';

import { styled } from '@/styles/stitches/stitches.config';

import Icon from '@/components/icons/Icon';
import isEmpty from '@/utils/isEmpty';
import Flex from './Flex';
import Text from './Text';

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

const StyledText = styled(Text, {
  fontSize: '$16',
  top: '0',
  p: '$16',
  pl: '$17',
  lineHeight: '24px',
  color: '$primary300',
  position: 'absolute',
  pointerEvents: 'none',
  transformOrigin: '0 0',
  transition: 'all .2s ease-in-out',
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

  const autoState = useMemo(() => {
    if (message) return 'error';
    if (isValueEmpty || (value && !touchedFields.text)) return 'default';
    return 'valid';
  }, [message, isValueEmpty, value, touchedFields.text]);

  const currentState = useMemo(() => {
    if (disabled && !touchedFields[id]) return 'default';
    return autoState;
  }, [autoState, disabled, id, touchedFields]);

  return (
    <Flex
      css={{ position: 'relative', width: '100%', height: 'auto' }}
      direction="column"
      ref={flexRef}
    >
      <Flex>
        {floatPlaceholder && (
          <Flex>
            <StyledTextArea
              {...rest}
              disabled={disabled}
              id={id}
              placeholder=" "
              variant={currentState}
              ref={(e) => {
                if (ref) ref(e);
                textareaRef.current = e;
              }}
            />
            <StyledText as="label" htmlFor={id}>
              {placeholder}
            </StyledText>
          </Flex>
        )}
      </Flex>
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
      {floatPlaceholder && (
        <Flex
          align="center"
          gap="4"
          css={{
            mt: '$8',
            '& svg': {
              height: '$16 !important',
              width: '$16 !important',
              color: '$dangerBase',
            },
          }}
        >
          {currentState === 'error' && <Icon css={{ width: '$24', height: '$24' }} name="info" />}
          <Text
            hint
            css={{
              color: currentState === 'error' ? '$dangerBase' : '$primary300',
            }}
          >
            {!isEmpty(helperText) ? helperText : errors[`${id}`]?.message}
          </Text>
        </Flex>
      )}
    </Flex>
  );
};
export default TextArea;
