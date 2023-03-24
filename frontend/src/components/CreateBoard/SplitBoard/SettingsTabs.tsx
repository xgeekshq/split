import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Tab, { TabList } from '@/components/Primitives/Tab/Tab';
import Text from '@/components/Primitives/Text/Text';
import { createBoardError, createBoardTeam } from '@/store/createBoard/atoms/create-board.atom';
import { toastState } from '@/store/toast/atom/toast.atom';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { usePrevious } from '@/utils/previousState';

import BoardConfigurations from '../BoardConfigurations/BoardConfigurations';
import SubTeamsConfigurations from './SubTeamsTab/SubTeamsTab';

const Settings = () => {
  // Recoil Atoms
  const haveError = useRecoilValue(createBoardError);
  const setToastState = useSetRecoilState(toastState);
  const selectedTeam = useRecoilValue(createBoardTeam);
  const prevTeam = usePrevious(selectedTeam?.id);

  const tabList: TabList[] = [
    {
      value: 'teams',
      label: 'Team/Sub-teams configurations',
      content: <SubTeamsConfigurations previousTeam={prevTeam} />,
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
      <Text heading={3} css={{ mt: '$16' }}>
        Settings
      </Text>
      <Tab
        tabList={tabList}
        defaultValue={initialTabValue}
        activeValue={activeTab}
        onChangeActiveValue={handleTabChange}
      />
    </Flex>
  );
};

export default Settings;
