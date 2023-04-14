import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Tab, { TabList } from '@/components/Primitives/Tab/Tab';
import Text from '@/components/Primitives/Text/Text';
import useCurrentSession from '@/hooks/useCurrentSession';
import {
  createBoardDataState,
  createBoardError,
} from '@/store/createBoard/atoms/create-board.atom';
import { usersListState } from '@/store/team/atom/team.atom';
import { toastState } from '@/store/toast/atom/toast.atom';
import { BoardUserRoles } from '@/utils/enums/board.user.roles';
import { ToastStateEnum } from '@/utils/enums/toast-types';

import BoardConfigurations from '@/components/CreateBoard/BoardConfigurations/BoardConfigurations';
import ParticipantsTab from '@/components/CreateBoard/RegularBoard/ParticipantsTab/ParticipantsTab';

type SettingsTabsProps = {
  isPageLoading: boolean;
};

const SettingsTabs = ({ isPageLoading }: SettingsTabsProps) => {
  const { userId } = useCurrentSession();

  // Recoil Atoms
  const haveError = useRecoilValue(createBoardError);
  const setToastState = useSetRecoilState(toastState);
  const [usersList, setUsersList] = useRecoilState(usersListState);
  const setCreateBoardData = useSetRecoilState(createBoardDataState);

  const [optionSelected, setOptionSelected] = useState('team');

  const tabList: TabList[] = [
    {
      value: 'participants',
      label: 'Participants',
      content: (
        <ParticipantsTab
          optionSelected={optionSelected}
          setOptionSelected={setOptionSelected}
          isPageLoading={isPageLoading}
        />
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

  useEffect(() => {
    const updateCheckedUser = usersList.map((user) => ({
      ...user,
      isChecked: user._id === userId || user.isChecked,
    }));

    const users = updateCheckedUser.flatMap((user) =>
      user.isChecked
        ? [
            {
              role: user._id === userId ? BoardUserRoles.RESPONSIBLE : BoardUserRoles.MEMBER,
              user,
              votesCount: 0,
            },
          ]
        : [],
    );
    setUsersList(updateCheckedUser);

    setCreateBoardData((prev) => ({
      ...prev,
      users,
      board: { ...prev.board, team: null },
    }));
  }, []);

  return (
    <Flex direction="column" gap={16}>
      <Text heading={3} css={{ mb: '$16' }}>
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

export default SettingsTabs;
