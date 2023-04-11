import { styled } from '@stitches/react';
import DatePicker from 'react-datepicker';

const StyledDatePicker = styled(DatePicker, {
  backgroundColor: 'blue',
  '.react-datepicker__month': {
    backgroundColor: 'red',
  },
});
export default StyledDatePicker;
