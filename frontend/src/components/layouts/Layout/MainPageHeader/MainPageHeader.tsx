import Link from 'next/link';

import Icon from '@/components/Primitives/Icons/Icon/Icon';
import Button from '@/components/Primitives/Inputs/Button/Button';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';

export type MainPagerHeaderProps = {
  title: string;
  button?: { link: string; label: string };
};

const MainPageHeader = ({ title, button }: MainPagerHeaderProps) => (
  <Flex data-testid="MainPageHeader" justify="between">
    <Text heading="1">{title}</Text>
    {button && (
      <Link href={button.link ?? '#'} style={{ height: 'fit-content' }}>
        <Button size="sm">
          <Icon name="plus" />
          {button.label}
        </Button>
      </Link>
    )}
  </Flex>
);

export default MainPageHeader;
