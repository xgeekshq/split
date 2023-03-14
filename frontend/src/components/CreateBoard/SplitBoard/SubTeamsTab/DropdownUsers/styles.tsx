import Flex from '@/components/Primitives/Layout/Flex/Flex';
import { styled } from '@/styles/stitches/stitches.config';

const DropdownContent = styled('div', {
  display: 'none',
  position: 'absolute',
  backgroundColor: 'white',
  minWidth: '100%',
  zIndex: 1,
  borderRadius: '$12',
  px: '$20',
  py: '$16',
  boxShadow: '0px 4px 16px -4px rgba(18, 25, 34, 0.2)',
  marginTop: '$2',
});

const Dropdown = styled(Flex, {
  position: 'relative',
  '&:hover': {
    display: 'block',
    [`& ${DropdownContent}`]: {
      display: 'block',
      width: ' 100%',
      minWidth: 0,
    },
  },
  width: ' 100%',
  minWidth: 0,
});

const DropdownBtn = styled('button', {
  color: 'white',
  border: 'none',
  cursor: 'pointer',
  width: ' 100%',
  padding: 0,
  minWidth: 0,
  '&:hover': {
    display: 'block',
  },
});

const DropdownItem = styled(Flex, {
  height: '$36',
  py: '$8',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
});

export { Dropdown, DropdownBtn, DropdownContent, DropdownItem };
