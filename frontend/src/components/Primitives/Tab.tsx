import * as Tabs from '@radix-ui/react-tabs';

import { styled } from '@/styles/stitches/stitches.config';

import Flex from './Flex';
import Text from './Text';

const StyledTabsRoot = styled(Tabs.Root, Flex, {});

const StyledTabsList = styled(Tabs.List, Flex, {
  borderBottom: '1px solid $primary200',
  gap: '$24',
});

const StyledTabsTrigger = styled(Tabs.Trigger, Text, {
  border: 'none',
  background: 'none',
  p: '$12',
  lineHeight: '$20',
  color: '$primary300',
  '&:hover': {
    cursor: 'pointer',
  },
  '&[data-state="active"]': {
    color: '$primaryBase',
    fontWeight: '$bold',
    borderBottom: '2px solid $primaryBase',
    marginBottom: '-1.5px',
  },
});

type TabList = {
  value: string;
  text: string;
};

type TabType = {
  tabList: TabList[];
  defaultValue?: string;
  activeValue?: string;
  onChangeActiveValue?: (newTab: string) => void;
};

type TabProps = TabType & React.ComponentProps<typeof Tabs.Root>;

const Tab: React.FC<TabProps> = ({
  tabList,
  defaultValue,
  activeValue,
  onChangeActiveValue,
  children,
}) => {
  const initialValue = defaultValue ?? tabList[0].value;

  return (
    <StyledTabsRoot
      direction="column"
      defaultValue={initialValue}
      value={activeValue}
      onValueChange={onChangeActiveValue}
    >
      <StyledTabsList>
        {tabList.map((tab) => (
          <StyledTabsTrigger value={tab.value} key={tab.value}>
            {tab.text}
          </StyledTabsTrigger>
        ))}
      </StyledTabsList>
      <Flex direction="column" css={{ mt: '$24' }}>
        {children}
      </Flex>
    </StyledTabsRoot>
  );
};

export default Tab;
export const TabContent = Tabs.Content;
