import Flex from '@/components/Primitives/Layout/Flex/Flex';
import { styled } from '@/styles/stitches/stitches.config';

const UserNamesContainer = styled(Flex, {
  height: '$64',
  flex: 1,
  py: '$12',
  px: '$16',
  border: '1px solid $primary200',
  borderRadius: '$4',
});

const DropdownContent = styled('div', {
  width: '100%',
  display: 'none',
  position: 'absolute',
  backgroundColor: '$white',
  zIndex: 1,
  borderRadius: '$12',
  mt: '$2',
  px: '$20',
  py: '$12',
  boxShadow: '0px 4px 16px -4px rgba(18, 25, 34, 0.2)',
});

const Dropdown = styled(Flex, {
  flex: 1,
  position: 'relative',
  cursor: 'pointer',
  '&:hover': {
    display: 'block',
    [`& ${DropdownContent}`]: {
      display: 'block',
    },
  },
});

const DropdownItem = styled(Flex, {
  py: '$8',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
});

export { UserNamesContainer, Dropdown, DropdownContent, DropdownItem };
