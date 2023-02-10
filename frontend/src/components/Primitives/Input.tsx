import React, { useMemo, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { styled } from '@/styles/stitches/stitches.config';

import Icon from '@/components/icons/Icon';
import isEmpty from '@/utils/isEmpty';
import Flex from './Flex';
import Text from './Text';

const StyledInputWrapper = styled(Flex, {
  px: '$16',
  boxShadow: '0',
  border: '1px solid $primary200',
  outline: 'none',
  width: '100%',
  borderRadius: '$4',
  backgroundColor: '$white',
  alignItems: 'center',
  '&[data-iconposition="left"]': {
    flexDirection: 'row',
    //   '&:not(:placeholder-shown) ~ label': {
    //     transform: `scale(0.875) translateX(0.5rem) translateY(-0.5rem)`,
    //   },
    //   '&:focus ~ label': {
    //     transform: `scale(0.875) translateX(0.5rem) translateY(-0.5rem)`,
    //   },
  },
  '&[data-iconposition="right"]': {
    flexDirection: 'row-reverse',
  },
  variants: {
    variant: {
      default: {
        '&:focus': {
          borderColor: '$primary400',
          boxShadow: '0px 0px 0px 2px $colors$primaryLightest',
        },
        '&:-webkit-autofill': {
          '-webkit-box-shadow':
            '0 0 0px 1000px white inset, 0px 0px 0px 2px $colors$primaryLightest',
        },
      },
      valid: {
        borderColor: '$success700',
        boxShadow: '0px 0px 0px 2px $colors$successLightest',
        '&:-webkit-autofill': {
          '-webkit-box-shadow':
            '0 0 0px 1000px white inset, 0px 0px 0px 2px $colors$successLightest',
        },
      },
      error: {
        borderColor: '$danger700',
        boxShadow: '0px 0px 0px 2px $colors$dangerLightest',
        '&:-webkit-autofill': {
          '-webkit-box-shadow':
            '0 0 0px 1000px white inset, 0px 0px 0px 2px $colors$dangerLightest',
        },
      },
    },
    disabled: {
      true: {
        backgroundColor: '$primary50',
      },
    },
  },
});

const PlaceholderText = styled(Text, {
  color: '$primary300',
  position: 'absolute',
  pointerEvents: 'none',
  transformOrigin: '0 0',
  transition: 'all .2s ease-in-out',
  py: '$16',
});

const IconWrapper = styled(Flex, {
  alignItems: 'center',
  cursor: 'default',
  p: '$2',
  '&[data-type="password"]': {
    '&:hover': {
      cursor: 'pointer',
    },
  },
});

const HelperTextWrapper = styled(Flex, {
  '& svg': {
    flex: '0 0 16px',
    height: '$16 ',
    width: '$16 ',
  },
  variants: {
    color: {
      error: {
        [`& ${Text}`]: {
          color: '$dangerBase',
        },
        '& svg': {
          color: '$dangerBase',
        },
      },
      hint: {
        [`& ${Text}`]: {
          color: '$primary300',
        },
        '& svg': {
          color: '$primary300',
        },
      },
    },
  },
});

const StyledInput = styled('input', {
  // Reset
  appearance: 'none',
  borderWidth: '0',
  boxShadow: '0',
  boxSizing: 'border-box',
  margin: '0',
  outlineOffset: '0',
  padding: '0',
  fontFamily: '$body',
  WebkitTapHighlightColor: 'rgba(0,0,0,0)',
  backgroundColor: '$transparent',
  '&::before': {
    boxSizing: 'border-box',
  },
  '&::after': {
    boxSizing: 'border-box',
  },
  '&:-internal-autofill-selected': {
    backgroundColor: '$transparent',
  },

  '&:-webkit-autofill,&:-webkit-autofill:active,&:-webkit-autofill:focus': {
    '-webkit-box-shadow': '0 0 0px 1000px white inset, 0px 0px 0px 2px $colors$successLightest',
  },

  '&:-webkit-autofill::first-line': {
    color: '$dangerBase',
    fontFamily: '$body',
    fontSize: '$16',
  },

  ':-internal-autofill-previewed': {
    fontFamily: '$body',
    fontSize: '$16',
  },

  // Custom
  fontSize: '$16',
  lineHeight: '$20',
  outline: 'none',
  width: '100%',
  height: '$56',
  pt: '$28',
  pb: '$8',
  '&::-webkit-input-placeholder': {
    fontSize: '22px !important',
    color: '$primary300',
  },
  color: '$primaryBase',
  '&::placeholder': {
    '&:disabled': {
      color: '$primaryBase',
    },
    color: '$primary300',
  },
  '&:not(:placeholder-shown) ~ label': {
    transform: `scale(0.875) translateX(0.2rem) translateY(-0.5rem)`,
  },
  '&:-internal-autofill-selected ~ label': {
    transform: `scale(0.875) translateX(0.2rem) translateY(-0.5rem)`,
  },
  '&:focus ~ label': {
    transform: `scale(0.875) translateX(0.2rem) translateY(-0.5rem)`,
  },
});

type StyledInpupProps = React.ComponentProps<typeof StyledInput>;

interface InputProps extends StyledInpupProps {
  id: string;
  type: 'text' | 'password' | 'email' | 'number';
  placeholder: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
  helperText?: string;
  disabled?: boolean;
  maxChars?: string;
  showCount?: boolean;
}

const Input: React.FC<InputProps> = ({
  id,
  placeholder,
  icon,
  iconPosition,
  helperText,
  type,
  disabled,
  css,
  maxChars,
  min,
  showCount,
}) => {
  Input.defaultProps = {
    iconPosition: undefined,
    icon: undefined,
    helperText: '',
    disabled: false,
    maxChars: undefined,
    showCount: false,
  };
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [currentType, setType] = useState(type);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const {
    register,
    getValues,
    clearErrors,
    trigger: revalidateInput,
    formState: { errors, dirtyFields },
  } = useFormContext();
  const { ref, onChange, ...rest } = register(id);

  const errorMessage = errors[id]?.message;

  const value = getValues()[id];
  const isValueEmpty = isEmpty(value);

  const getCurrentState = useMemo(() => {
    if (!dirtyFields[id]) return 'default';

    if (errors[id]) return 'error';
    if (!isValueEmpty) return 'valid';
    return 'default';
  }, [dirtyFields[id], errors[id], isValueEmpty]);

  const isHelperEmpty = isEmpty(helperText) && isEmpty(errorMessage);

  const handleOnClickIcon = () => {
    setIsVisible((prevState) => !prevState);

    if (type === 'text') return;
    setType(currentType === 'password' ? 'text' : 'password');
  };

  const iconToShow = () => {
    if (type === 'password') {
      return isVisible ? 'eye' : 'eye-slash';
    }

    return icon ?? '';
  };

  return (
    <Flex
      css={{ position: 'relative', width: '100%', mb: '$16', height: 'auto', ...css }}
      direction="column"
      onBlur={() => {
        if (isValueEmpty) {
          clearErrors(id);
        }
      }}
    >
      <StyledInputWrapper
        gap="8"
        variant={getCurrentState}
        data-iconposition={iconPosition}
        disabled={disabled}
      >
        {!!icon && (
          <IconWrapper data-type={type} onClick={handleOnClickIcon}>
            <Icon
              name={iconToShow()}
              css={{
                color: '$primary300',
              }}
            />
          </IconWrapper>
        )}
        <Flex css={{ flexGrow: '1' }}>
          <StyledInput
            {...rest}
            autoComplete="off"
            data-iconposition={iconPosition}
            data-state={getCurrentState}
            disabled={disabled}
            id={id}
            min={min}
            placeholder=" "
            type={currentType}
            ref={(e) => {
              ref(e);
              inputRef.current = e;
            }}
            onFocus={() => {
              if (!isValueEmpty) {
                revalidateInput(id);
              }
            }}
            onChange={onChange}
          />
          <PlaceholderText as="label" data-iconposition={iconPosition} htmlFor={id}>
            {placeholder}
          </PlaceholderText>
        </Flex>
      </StyledInputWrapper>
      {(!isEmpty(helperText) || !isEmpty(errorMessage)) && (
        <HelperTextWrapper
          css={{ mt: '$8', px: '$4' }}
          justify={!isHelperEmpty ? 'between' : 'end'}
          color={getCurrentState === 'error' ? 'error' : 'hint'}
        >
          {!isHelperEmpty && (
            <Flex gap="4" css={{ flexGrow: '1' }}>
              {!isEmpty(errorMessage) && getCurrentState === 'error' && <Icon name="error" />}
              {!isEmpty(helperText) && getCurrentState !== 'error' && <Icon name="info" />}

              <Text hint>
                {!isEmpty(helperText) && getCurrentState !== 'error' ? helperText : errorMessage}
              </Text>
            </Flex>
          )}
          {showCount && <Text hint>{`${value.length}/${maxChars}`}</Text>}
        </HelperTextWrapper>
      )}
    </Flex>
  );
};

export default Input;
