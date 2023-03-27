import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { ToastStateEnum } from '@/utils/enums/toast-types';
import { toastState } from '@/store/toast/atom/toast.atom';
import Text from '@/components/Primitives/Text/Text';
import Tab, { TabList } from '@/components/Primitives/Tab/Tab';
import { createBoardError } from '@/store/createBoard/atoms/create-board.atom';
import ParticipantsTab from '../ParticipantsTab';
import BoardConfigurations from '../../BoardConfigurations/BoardConfigurations';

const SettingsTabs = () => {
  // Recoil Atoms
  const haveError = useRecoilValue(createBoardError);
  const setToastState = useSetRecoilState(toastState);
  const [optionSelected, setOptionSelected] = useState('team');

  const tabList: TabList[] = [
    {
      value: 'participants',
      label: 'Participants',
      content: (
        <ParticipantsTab optionSelected={optionSelected} setOptionSelected={setOptionSelected} />
      ),
    },
    {
      value: 'config',
      label: 'Configurations',
      content: <BoardConfigurations isRegularBoard />,
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
      handleTabChange('participants');
      setToastState({
        open: true,
        content: 'Please choose a team in the "Team/-Sub-teams configuration" tab',
        type: ToastStateEnum.ERROR,
      });
    }
  }, [activeTab, errors.maxVotes, errors.team, setToastState]);

  return (
    <>
      <Text heading={3} css={{ mb: '$16', mt: '$32' }}>
        Settings
      </Text>
      <Tab
        tabList={tabList}
        defaultValue={initialTabValue}
        activeValue={activeTab}
        onChangeActiveValue={handleTabChange}
      />
    </>
  );
};

export default SettingsTabs;
