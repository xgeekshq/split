import Icon from '@/components/icons/Icon';
import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import { DisabledStylesBox, StyledBox } from './styles';

type BoxRowContainerProps = {
  iconName: string;
  title: string;
  description: string;
  active: boolean;
};

export const BoxRowContainer = ({ iconName, title, description, active }: BoxRowContainerProps) => {
  if (active)
    return (
      <StyledBox elevation={2} align="start" gap={10}>
        <Flex>
          <Icon name={iconName} css={{ height: '$40', width: '$40' }} />
        </Flex>
        <Flex direction="column" gap={8}>
          <Text color="primary800" heading={4}>
            {title}
          </Text>
          <Text size="md" color="primary500">
            {description}
          </Text>
        </Flex>
      </StyledBox>
    );
  return (
    <DisabledStylesBox elevation={2} align="start" gap={10}>
      <Flex>
        <Icon name={iconName} css={{ height: '$40', width: '$40' }} />
      </Flex>
      <Flex direction="column" gap={8}>
        <Text color="primary800" heading={4}>
          {title}
        </Text>
        <Text size="md" color="primary500">
          {description}
        </Text>
      </Flex>
    </DisabledStylesBox>
  );
};
