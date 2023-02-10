import React, { useMemo, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { styled } from '@/styles/stitches/stitches.config';

import Icon from '@/components/icons/Icon';
import isEmpty from '@/utils/isEmpty';
import Flex from './Flex';
import Text from './Text';

const StyledInputWrapper = styled(Flex, {
  // outline: '1px solid #ff00ff', // Debug Only
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
    color: '$dangerBase',
  },
  '& *:not(svg)': { flex: '1 1 auto' },
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
  state?: 'default' | 'error' | 'valid';
  type: 'text' | 'password' | 'email' | 'number';
  placeholder: string;
  icon?: string;
  helperText?: string;
  iconPosition?: 'left' | 'right';
  forceState?: boolean;
  disabled?: boolean;
  clearErrorCode?: () => void;
  currentValue?: string;
  maxChars?: string;
  showCount?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
  forceState,
  clearErrorCode,
  currentValue,
  maxChars,
  min,
  showCount,
  onChange,
}) => {
  Input.defaultProps = {
    state: undefined,
    iconPosition: undefined,
    icon: undefined,
    helperText: '',
    disabled: false,
    clearErrorCode: undefined,
    currentValue: undefined,
    maxChars: undefined,
    forceState: false,
    showCount: false,
  };
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [currentType, setType] = useState(type);

  const {
    register,
    getValues,
    clearErrors,
    formState: { errors, touchedFields },
  } = useFormContext();
  const { ref, ...rest } = register(id);

  const message = errors[id]?.message;

  const value = getValues()[id];
  const isValueEmpty = isEmpty(value);

  const autoState = useMemo(() => {
    if (errors[id]) return 'error';
    if (!message && !isValueEmpty) return 'valid';
    return undefined;
  }, [errors, message, isValueEmpty]);

  const currentState = useMemo(() => {
    if (disabled && !touchedFields[id] && !forceState) return 'default';
    if (state && forceState && !touchedFields[id]) return autoState;
    return autoState;
  }, [autoState, disabled, forceState, id, state, touchedFields]);

  const isHelperEmpty = isEmpty(helperText) && isEmpty(message);

  const [isVisible, setIsVisible] = useState<boolean>(false);

  const handleVisibility = () => setIsVisible((prevState) => !prevState);

  const handleOnClickIcon = () => {
    handleVisibility();
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
        variant={currentState}
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
            data-state={currentState}
            disabled={disabled}
            id={id}
            min={min}
            placeholder=" "
            type={currentType}
            ref={(e) => {
              ref(e);
              inputRef.current = e;
            }}
            onFocus={clearErrorCode}
            onChange={onChange}
          />
          <PlaceholderText as="label" data-iconposition={iconPosition} htmlFor={id}>
            {placeholder}
          </PlaceholderText>
        </Flex>
      </StyledInputWrapper>
      <Flex justify={!isHelperEmpty ? 'between' : 'end'}>
        {!isHelperEmpty && (
          <HelperTextWrapper css={{ mt: '$8' }} gap="4">
            {currentState === 'error' && <Icon name="info" />}
            <Text
              hint
              css={{
                color: currentState === 'error' ? '$dangerBase' : '$primary300',
              }}
            >
              {!isEmpty(helperText) ? helperText : message}
            </Text>
          </HelperTextWrapper>
        )}
        {(!!currentValue || !currentValue) && (
          <Text
            hint
            color={currentState === 'error' ? 'dangerBase' : 'primary300'}
            css={{
              mt: '$8',
            }}
          >
            {showCount && !currentValue && `0/${maxChars}`}
            {!!currentValue && `${currentValue.length}/${maxChars}`}
          </Text>
        )}
      </Flex>
    </Flex>
  );
};

export default Input;
