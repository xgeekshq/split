import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Flex from '@/components/Primitives/Layout/Flex';
import Text from '@/components/Primitives/Text/Text';
import { styled } from '@/styles/stitches/stitches.config';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { StyledBox } from './styles';

type BoxColumnContainerProps = {
  iconName: string;
  title: string;
  description: string;
  route: string;
};

type BoxColumnContainerContentProps = {
  iconName: string;
  description: string;
  title: string;
};

const StyledA = styled('a', { textDecoration: 'none' });

const BoxColumnContainerContent = ({
  iconName,
  description,
  title,
}: BoxColumnContainerContentProps) => (
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
);

export const BoxColumnContainer = ({
  iconName,
  title,
  description,
  route,
}: BoxColumnContainerProps) => {
  const router = useRouter();
  const hasRouteQuery = router.query.team;

  return hasRouteQuery ? (
    <Link href={{ pathname: route, query: { team: router.query.team } }}>
      <StyledA>
        <BoxColumnContainerContent iconName={iconName} description={description} title={title} />
      </StyledA>
    </Link>
  ) : (
    <Link href={route}>
      <StyledA>
        <BoxColumnContainerContent iconName={iconName} description={description} title={title} />
      </StyledA>
    </Link>
  );
};
