import Box from '@/components/Primitives/Box';
import Flex from '@/components/Primitives/Flex';
import { styled } from '@/styles/stitches/stitches.config';
import Select, { CSSObjectWithLabel } from 'react-select';

const StyledBox = styled(Flex, Box, {});

const HelperTextWrapper = styled(Flex, {
  '& svg': {
    flex: '0 0 16px',
    height: '$16 ',
    width: '$16 ',
    color: '$dangerBase',
  },
  '& *:not(svg)': { flex: '1 1 auto' },
});

export const selectStyles = {
  control: (styles: CSSObjectWithLabel) => ({
    ...styles,
    backgroundColor: 'transparent',
    border: 'none',
    boxShadow: 'none',
    fontSize: '16px',
    cursor: 'pointer',
  }),
  menu: (base: CSSObjectWithLabel) => ({
    ...base,
    marginTop: 0,
  }),
  valueContainer: (base: CSSObjectWithLabel) => ({
    ...base,
    paddingLeft: 0,
    paddingTop: 0,
  }),
  input: (base: CSSObjectWithLabel) => ({
    ...base,
    paddingTop: 0,
    margin: 0,
  }),
  singleValue: (base: CSSObjectWithLabel) => ({
    ...base,
    paddingLeft: 0,
  }),
  indicatorContainer: (base: CSSObjectWithLabel) => ({
    ...base,
    paddingTop: 0,
  }),
};

const StyledSelect = styled(Select, {});

export { StyledSelect, StyledBox, HelperTextWrapper };
