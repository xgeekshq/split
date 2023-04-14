import Select, { CSSObjectWithLabel } from 'react-select';

import { styled } from '@/styles/stitches/stitches.config';

const filterByTeamSelectStyles = {
  control: (styles: CSSObjectWithLabel) => ({
    ...styles,
    backgroundColor: 'white',
    minWidth: 0,
    width: '179px',
    minHeight: '36px',
    height: '36px',
    borderRadius: '12px',
    borderTopLeftRadius: '0',
    borderBottomLeftRadius: '0',
    border: '1px solid $primary200',
    fontSize: '14px',
    cursor: 'pointer',
    boxShadow: 'none',
  }),
  menu: (base: CSSObjectWithLabel) => ({
    ...base,
    marginTop: 2,
    paddingTop: '6px',
    paddingBottom: '6px',
    borderRadius: '12px',
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
    paddingLeft: 0,
  }),
  singleValue: (base: CSSObjectWithLabel) => ({
    ...base,
    paddingLeft: 0,
  }),
  indicatorsContainer: (base: CSSObjectWithLabel) => ({
    ...base,
    marginRight: -3,
    padding: 0,
  }),
  dropdownIndicator: (base: CSSObjectWithLabel) => ({
    ...base,
    padding: 0,
  }),
  option: (base: CSSObjectWithLabel, state: any) => ({
    ...base,
    backgroundColor: state.isSelected ? '#2F3742' : 'white',
    color: state.isSelected ? 'white' : '#060D16',
    '&:hover': {
      ...base,
      cursor: 'pointer',
      backgroundColor: '#2F3742',
      color: 'white',
    },
  }),
};

const StyledSelect = styled(Select, {});

export { filterByTeamSelectStyles, StyledSelect };
