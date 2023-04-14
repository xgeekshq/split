import { ReactNode } from 'react';
import * as Tabs from '@radix-ui/react-tabs';

import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Text from '@/components/Primitives/Text/Text';
import { styled } from '@/styles/stitches/stitches.config';

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

export type TabList = {
  value: string;
  label: string;
  content: ReactNode;
};

type TabType = {
  tabList: TabList[];
  defaultValue?: string;
  activeValue?: string;
  onChangeActiveValue?: (newTab: string) => void;
};

export type TabProps = TabType & React.ComponentProps<typeof Tabs.Root>;

const Tab = ({ tabList, defaultValue, activeValue, onChangeActiveValue, children }: TabProps) => {
  const initialValue = defaultValue ?? tabList[0].value;

  return (
    <StyledTabsRoot
      data-testid="tabs"
      defaultValue={initialValue}
      direction="column"
      onValueChange={onChangeActiveValue}
      value={activeValue}
    >
      <StyledTabsList>
        {tabList.map((tab) => (
          <StyledTabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </StyledTabsTrigger>
        ))}
      </StyledTabsList>
      <Flex css={{ mt: '$24' }} direction="column">
        {tabList.map((tab) => (
          <Tabs.Content key={tab.value} value={tab.value}>
            {tab.content}
          </Tabs.Content>
        ))}
        {children}
      </Flex>
    </StyledTabsRoot>
  );
};

export default Tab;
