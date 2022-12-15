import Icon from '@/components/icons/Icon';
import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import Link from 'next/link';
import { StyledBox } from './styles';

type BoxColumnContainerProps = {
  iconName: string;
  title: string;
  description: string;
  route: string;
};

export const BoxColumnContainer = ({
  iconName,
  title,
  description,
  route,
}: BoxColumnContainerProps) => (
  <Link href={route}>
    <StyledBox elevation={2} direction="column" gap={10}>
      <Icon name={iconName} css={{ height: '$40', width: '$40' }} />
      <Flex direction="column" gap={8} css={{ mt: '$20' }}>
        <Text color="primary800" heading={4}>
          {title}
        </Text>
        <Text size="md" color="primary500">
          {description}
        </Text>
      </Flex>
    </StyledBox>
  </Link>
);
