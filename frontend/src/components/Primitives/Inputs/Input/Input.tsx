import React, { useMemo, useRef, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import Icon from '@/components/Primitives/Icons/Icon/Icon';
import {
  HelperTextWrapper,
  IconWrapper,
  PlaceholderText,
  StyledInput,
  StyledInputWrapper,
} from '@/components/Primitives/Inputs/Input/styles';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import isEmpty from '@/utils/isEmpty';

type InputProps = {
  id: string;
  type: 'text' | 'password' | 'email' | 'number';
  placeholder?: string;
  icon?: 'eye' | 'eye-slash' | 'search';
  iconPosition?: 'left' | 'right';
  helperText?: string;
  disabled?: boolean;
  maxChars?: string;
  showCount?: boolean;
} & React.ComponentProps<typeof StyledInput>;

const Input = ({
  id,
  placeholder,
  icon,
  iconPosition,
  helperText = '',
  type,
  disabled = false,
  css,
  maxChars,
  min,
  showCount = false,
}: InputProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [currentType, setType] = useState(type);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const {
    register,
    clearErrors,
    trigger: revalidateInput,
    formState: { errors, dirtyFields },
    getFieldState,
  } = useFormContext();
  const { ref, onChange, ...rest } = register(id);

  const { error, isDirty } = getFieldState(id);
  const errorMessage = error?.message;
  const value = useWatch({ name: id });
  const isValueEmpty = isEmpty(value);

  const getCurrentState = useMemo(() => {
    if (error) return 'error';
    if (!isDirty) return 'default';
    if (!isValueEmpty) return 'valid';

    return 'default';
  }, [errors, dirtyFields, error, isDirty, isValueEmpty]);

  const isHelperEmpty = isEmpty(helperText) && isEmpty(errorMessage);

  const handleOnClickIcon = () => {
    if (type === 'text') return;

    setIsVisible((prevState) => !prevState);
    setType(currentType === 'password' ? 'text' : 'password');
  };

  const iconToShow = () => {
    if (type === 'password') {
      return isVisible ? 'eye' : 'eye-slash';
    }

    return icon ?? '';
  };

  const onBlurHandler = () => {
    if (isValueEmpty) {
      clearErrors(id);
    }
  };

  const onFocusHandler = () => {
    if (!isValueEmpty) {
      revalidateInput(id);
    }
  };

  return (
    <Flex
      css={{ position: 'relative', width: '100%', mb: '$16', height: 'auto', ...css }}
      direction="column"
      onBlur={onBlurHandler}
    >
      <StyledInputWrapper
        data-iconposition={iconPosition}
        disabled={disabled}
        gap="8"
        variant={getCurrentState}
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
            onChange={onChange}
            onFocus={onFocusHandler}
            placeholder=" "
            type={currentType}
            ref={(e) => {
              ref(e);
              inputRef.current = e;
            }}
            {...(placeholder && { css: { pt: '$28', pb: '$8' } })}
          />
          {placeholder && (
            <PlaceholderText as="label" data-iconposition={iconPosition} htmlFor={id}>
              {placeholder}
            </PlaceholderText>
          )}
        </Flex>
      </StyledInputWrapper>
      {(!isHelperEmpty || showCount) && (
        <HelperTextWrapper
          color={getCurrentState === 'error' ? 'error' : 'hint'}
          css={{ mt: '$8', px: '$4' }}
          justify={!isHelperEmpty ? 'between' : 'end'}
        >
          {!isHelperEmpty && (
            <Flex css={{ flexGrow: '1' }} gap="4">
              {!isEmpty(errorMessage) && getCurrentState === 'error' && <Icon name="error" />}
              {!isEmpty(helperText) && getCurrentState !== 'error' && <Icon name="info" />}

              <Text hint>
                {!isEmpty(helperText) && getCurrentState !== 'error' ? helperText : errorMessage}
              </Text>
            </Flex>
          )}
          {showCount && <Text hint>{`${value?.length ?? '0'}/${maxChars}`}</Text>}
        </HelperTextWrapper>
      )}
    </Flex>
  );
};

export default Input;
