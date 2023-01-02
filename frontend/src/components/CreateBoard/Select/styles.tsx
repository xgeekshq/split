import Box from '@/components/Primitives/Box';
import Flex from '@/components/Primitives/Flex';
import { styled } from '@/styles/stitches/stitches.config';
import Select, { CSSObjectWithLabel } from 'react-select';

const selectStyles = {
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

const StyledBox = styled(Flex, Box, {});

export { selectStyles, StyledSelect, StyledBox };
