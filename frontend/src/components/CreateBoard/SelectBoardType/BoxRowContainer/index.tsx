import Icon from '@/components/Primitives/Icon';
import Flex from '@/components/Primitives/Layout/Flex';
import Text from '@/components/Primitives/Text';
import { DisabledStylesBox, StyledBox } from './styles';

type BoxRowContainerProps = {
  iconName: string;
  title: string;
  description: string;
  active: boolean;
  handleSelect?: () => void;
};

export const BoxRowContainer = ({
  iconName,
  title,
  description,
  active,
  handleSelect,
}: BoxRowContainerProps) => {
  if (active)
    return (
      <StyledBox elevation={2} align="start" gap={10} onClick={handleSelect}>
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
