import Flex from '@/components/Primitives/Layout/Flex/Flex';
import { styled } from '@/styles/stitches/stitches.config';
import * as HoverCard from '@radix-ui/react-hover-card';

const UserNamesContainer = styled(HoverCard.Trigger, Flex, {
  height: '$64',
  flex: 1,
  py: '$12',
  px: '$16',
  border: '1px solid $primary200',
  borderRadius: '$4',
});

const DropdownContent = styled(HoverCard.Content, {
  width: 'var(--radix-hover-card-trigger-width)',
  maxHeight: 'var(--radix-hover-card-content-available-height)',
  overflow: 'auto',
  backgroundColor: '$white',
  borderRadius: '$12',
  px: '$20',
  py: '$12',
  boxShadow: '0px 4px 16px -4px rgba(18, 25, 34, 0.2)',
});

const DropdownItem = styled(Flex, {
  py: '$8',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
});

const Dropdown = styled(HoverCard.Root, {});

export { UserNamesContainer, Dropdown, DropdownContent, DropdownItem };
