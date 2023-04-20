import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import BoardConfigurations from '@/components/CreateBoard/BoardConfigurations/BoardConfigurations';
import SubTeamsConfigurations from '@/components/CreateBoard/SplitBoard/SubTeamsTab/SubTeamsTab';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Tab, { TabList } from '@/components/Primitives/Tab/Tab';
import Text from '@/components/Primitives/Text/Text';
import { createBoardError } from '@/store/createBoard/atoms/create-board.atom';
import { toastState } from '@/store/toast/atom/toast.atom';
import { ToastStateEnum } from '@/utils/enums/toast-types';

const SettingsTabs = () => {
  // Recoil Atoms
  const haveError = useRecoilValue(createBoardError);
  const setToastState = useSetRecoilState(toastState);

  const tabList: TabList[] = [
    {
      value: 'teams',
      label: 'Team/Sub-teams configurations',
      content: <SubTeamsConfigurations />,
    },
    {
      value: 'config',
      label: 'Configurations',
      content: <BoardConfigurations />,
    },
  ];
  const initialTabValue = tabList[0].value;
  const [activeTab, setActiveTab] = useState(initialTabValue);

  const {
    formState: { errors },
  } = useFormContext();

  const handleTabChange = (newTab: string) => {
    if (haveError) return;
    setActiveTab(newTab);
  };

  useEffect(() => {
    if (errors.maxVotes) {
      handleTabChange('config');
    }

    if (errors.team && activeTab === 'config') {
      handleTabChange('teams');
      setToastState({
        open: true,
        content: 'Please choose a team in the "Team/-Sub-teams configuration" tab',
        type: ToastStateEnum.ERROR,
      });
    }
  }, [activeTab, errors.maxVotes, errors.team, setToastState]);

  return (
    <Flex direction="column" gap={16}>
      <Text css={{ mt: '$16' }} heading={3}>
        Settings
      </Text>
      <Tab
        activeValue={activeTab}
        defaultValue={initialTabValue}
        onChangeActiveValue={handleTabChange}
        tabList={tabList}
      />
    </Flex>
  );
};

export default SettingsTabs;
