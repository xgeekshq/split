import React from 'react';

import Icon from '@/components/Primitives/Icon';
import Flex from '@/components/Primitives/Flex';
import { IconWrapper, PlaceholderText, StyledInput } from './styles';

interface InputProps {
  id: string;
  placeholder: string;
  icon?: 'search';
  iconPosition?: 'left' | 'right' | 'both';
  disabled?: boolean;
  currentValue?: string;
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleClear?: () => void;
}

const SearchInput: React.FC<InputProps> = ({
  id,
  placeholder,
  icon,
  iconPosition,
  disabled,
  currentValue,
  handleChange,
  handleClear,
}) => {
  SearchInput.defaultProps = {
    iconPosition: undefined,
    icon: undefined,
    disabled: false,
    currentValue: undefined,
    handleChange: undefined,
  };

  return (
    <Flex
      css={{ position: 'relative', width: '100%', mb: '$16', height: 'auto' }}
      direction="column"
    >
      {!!icon && (
        <IconWrapper data-iconposition={iconPosition === 'both' ? 'left' : iconPosition}>
          {icon === 'search' && (
            <Icon
              name="search"
              css={{
                width: '$24',
                height: '$24',
                color: '$primary300',
              }}
            />
          )}
        </IconWrapper>
      )}
      <Flex>
        <StyledInput
          autoComplete="off"
          data-iconposition={iconPosition}
          disabled={disabled}
          id={id}
          placeholder=" "
          value={currentValue}
          variant="default"
          onChange={handleChange}
        />
        <PlaceholderText as="label" data-iconposition={iconPosition} htmlFor={id}>
          {placeholder}
        </PlaceholderText>
      </Flex>
      <IconWrapper
        data-iconposition={iconPosition === 'both' ? 'right' : iconPosition}
        css={{
          width: '$24',
          height: '$24',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          borderRadius: '100%',
        }}
        onClick={handleClear}
      >
        <Icon
          name="close"
          size={16}
          css={{
            color: '$white',
            backgroundColor: '$primary100',
            borderRadius: '100%',
            padding: '2px',
          }}
        />
      </IconWrapper>
    </Flex>
  );
};

export default SearchInput;
