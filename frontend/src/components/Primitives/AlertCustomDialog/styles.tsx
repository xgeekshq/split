import { AlertDialogDescription } from '@radix-ui/react-alert-dialog';

import { styled } from '@/styles/stitches/stitches.config';

import Flex from '../Flex';
import Text from '../Text';

const DialogTitleContainer = styled(Flex, {
  px: '$32',
  py: '$24',
});

const StyledDialogTitle = styled('h4', Text, {
  margin: 0,
});

const StyledAlertDialogDescription = styled(AlertDialogDescription, {
  color: '$primary400',
  fontSize: '$16',
  lineHeight: '$24',
});

const DialogText = styled(Flex, {
  px: '$32',
  pt: '$24',

  variants: {
    ellipsis: {
      true: {
        '&>p': {
          '&>span': {
            display: '-webkit-box',
            '-webkit-line-clamp': 3 /* number of lines to show */,
            lineClamp: 3,
            '-webkit-box-orient': 'vertical',
            textOverflow: 'ellipsis',
          },
        },
      },
    },
  },

  '&>p': {
    margin: 0,

    '&>span': {
      wordBreak: 'break-all',
      overflow: 'hidden',

      fontWeight: '$bold',
    },
  },
});

const DialogButtons = styled(Flex, {
  py: '$32',
  px: '$32',
});

export {
  DialogButtons,
  DialogText,
  DialogTitleContainer,
  StyledAlertDialogDescription,
  StyledDialogTitle,
};
