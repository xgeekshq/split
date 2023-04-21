import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Box from '@/components/Primitives/Layout/Box/Box';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import { styled } from '@/styles/stitches/stitches.config';

const StyledCreateBoardBox = styled(Flex, Box, {
  borderRadius: '$12',
  background: 'white',
  variants: {
    type: {
      column: {
        width: '$308',
        height: '$260',
        py: '$24',
        px: '$32',
        mt: '$40',
      },
      row: {
        width: '$500',
        height: '$170',
        p: '$32',
      },
    },
    disabled: {
      true: {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
      false: {
        '&:hover': {
          cursor: 'pointer',
          background: 'black',
          [`& ${Text}`]: {
            color: 'white',
          },
        },
      },
    },
  },
  defaultVariants: {
    disabled: false,
    type: 'column',
  },
});

type CreateBoardBoxProps = {
  iconName: string;
  title: string;
  description: string;
  type: 'column' | 'row';
  disabled?: boolean;
  onClick?: () => void;
};

const CreateBoardBox = ({
  iconName,
  title,
  description,
  type,
  disabled = false,
  onClick,
}: CreateBoardBoxProps) => (
  <StyledCreateBoardBox
    align="start"
    direction={type}
    elevation={2}
    gap={20}
    type={type}
    {...(onClick && { onClick })}
    disabled={disabled}
  >
    <Flex>
      <Icon name={iconName} size={40} />
    </Flex>
    <Flex direction="column" gap={8}>
      <Text color="primary800" heading={4}>
        {title}
      </Text>
      <Text color="primary500" size="md">
        {description}
      </Text>
    </Flex>
  </StyledCreateBoardBox>
);

export default CreateBoardBox;
