import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { ToastStateEnum } from '@/utils/enums/toast-types';
import { toastState } from '@/store/toast/atom/toast.atom';
import Text from '@/components/Primitives/Text';
import Tab, { TabContent } from '@/components/Primitives/Tab';
import { usePrevious } from '@/utils/previousState';
import { createBoardError, createBoardTeam } from '@/store/createBoard/atoms/create-board.atom';
import TeamSubTeamsConfigurations from './SubTeamsTab/TeamSubTeamsConfigurations';
import BoardConfigurations from '../Configurations/BoardConfigurations';

const Settings = () => {
  const tabList = [
    { value: 'teams', text: 'Team/Sub-teams configurations' },
    { value: 'config', text: 'Configurations' },
  ];
  const initialTabValue = tabList[0].value;

  const [activeTab, setActiveTab] = useState(initialTabValue);

  /**
   * Recoil Atoms
   */
  const haveError = useRecoilValue(createBoardError);
  const setToastState = useSetRecoilState(toastState);
  const selectedTeam = useRecoilValue(createBoardTeam);
  const prevTeam = usePrevious(selectedTeam?.id);

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
    <>
      <Text heading={3} css={{ mb: '$16', mt: '$32' }}>
        Settings
      </Text>
      <Tab
        tabList={tabList}
        defaultValue={initialTabValue}
        activeValue={activeTab}
        onChangeActiveValue={handleTabChange}
      >
        <TabContent value="teams">
          <TeamSubTeamsConfigurations previousTeam={prevTeam} />
        </TabContent>
        <TabContent value="config">
          <BoardConfigurations />
        </TabContent>
      </Tab>
    </>
  );
};

export default Settings;
