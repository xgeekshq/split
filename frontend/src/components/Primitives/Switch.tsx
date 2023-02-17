import * as SwitchPrimitive from '@radix-ui/react-switch';

import { styled } from '@/styles/stitches/stitches.config';

import Flex from './Flex';
import Icon from '../icons/Icon';

const StyledThumb = styled(SwitchPrimitive.Thumb, Flex, {
  justifyContent: 'center',
  alignItems: 'center',
  top: '50%',
  position: 'absolute',
  backgroundColor: 'white',
  borderRadius: '$round',
  transition: 'transform 100ms',
  transform: 'translate(5%, -50%)',
  willChange: 'transform',
  cursor: 'pointer',
  '&[data-state="checked"]': {
    transform: 'translate(90%, -50%)',
  },
  '&[data-disabled]': {
    cursor: 'not-allowed',
  },
});

type SwitchThumbProps = {
  checked: boolean;
  icon: string;
};

const SwitchThumb = ({ checked, icon }: SwitchThumbProps) => (
  <StyledThumb>
    {checked && (
      <Icon
        name={icon}
        css={{
          color: '$successBase',
        }}
      />
    )}
  </StyledThumb>
);

const StyledSwitch = styled(SwitchPrimitive.Root, {
  all: 'unset',
  display: 'flex',
  backgroundColor: '$primary200',
  borderRadius: '$pill',
  position: 'relative',
  cursor: 'pointer',
  WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
  boxSizing: 'border-box',
  '&[data-state="checked"]': {
    backgroundColor: '$successBase',
  },
  '&[data-disabled]': {
    cursor: 'not-allowed',
    opacity: 0.5,
  },
  variants: {
    size: {
      xs: {
        flex: '0 0 $sizes$24',
        width: '$24',
        height: '$14',
        '& span': {
          width: '$12',
          height: '$12',
        },
        '& svg': {
          height: '$8 ',
          width: '$8',
        },
      },
      sm: {
        flex: '0 0 $sizes$35',
        width: '$35',
        height: '$20',
        '& span': {
          width: '$17',
          height: '$17',
        },
        '& svg': {
          height: '$10 ',
          width: '$10',
        },
      },
      md: {
        flex: '0 0 $sizes$42',
        width: '$42',
        height: '$24',
        '& span': {
          width: '$21',
          height: '$21',
        },
        '& svg': {
          height: '$12 ',
          width: '$12',
        },
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

type SwitchProps = {
  checked: boolean;
  size?: 'xs' | 'sm' | 'md';
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  defaultChecked?: boolean;
  asChild?: boolean;
  icon?: string;
};

const Switch = ({ checked, icon = 'check', ...props }: SwitchProps) => (
  <StyledSwitch checked={checked} {...props}>
    <SwitchThumb checked={checked} icon={icon} />
  </StyledSwitch>
);

export default Switch;
