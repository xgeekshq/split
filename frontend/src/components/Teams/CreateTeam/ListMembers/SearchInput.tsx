import React from 'react';

import Icon from '../../../icons/Icon';
import Flex from '../../../Primitives/Flex';
import { IconWrapper, PlaceholderText, StyledInput } from './styles';

interface InputProps {
  id: string;
  placeholder: string;
  icon?: 'search';
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  currentValue?: string;
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput: React.FC<InputProps> = ({
  id,
  placeholder,
  icon,
  iconPosition,
  disabled,
  currentValue,
  handleChange,
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
        <IconWrapper data-iconposition={iconPosition}>
          {icon === 'search' && (
            <Icon
              name="search"
              css={{
                width: '$24',
                height: '$24',
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
    </Flex>
  );
};

export default SearchInput;
