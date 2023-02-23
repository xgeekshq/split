import Flex from '@/components/Primitives/Flex';
import Text from '@/components/Primitives/Text';
import Link from 'next/link';
import Button from '@/components/Primitives/Button';
import Icon from '@/components/Primitives/Icon';

type DashboardLayoutProps = {
  title: string;
  button?: { link: string; label: string };
};

const MainPageHeader = ({ title, button }: DashboardLayoutProps) => (
  <Flex justify="between">
    <Text heading="1">{title}</Text>
    {button && (
      <Link href={button.link ?? '#'}>
        <Button size="sm">
          <Icon name="plus" />
          {button.label}
        </Button>
      </Link>
    )}
  </Flex>
);

export default MainPageHeader;
