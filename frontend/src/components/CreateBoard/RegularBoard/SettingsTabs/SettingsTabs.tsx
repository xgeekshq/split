import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import BoardConfigurations from '@/components/CreateBoard/BoardConfigurations/BoardConfigurations';
import ParticipantsTab from '@/components/CreateBoard/RegularBoard/ParticipantsTab/ParticipantsTab';
import Flex from '@/components/Primitives/Layout/Flex/Flex';
import Tab, { TabList } from '@/components/Primitives/Tab/Tab';
import Text from '@/components/Primitives/Text/Text';
import { createErrorMessage } from '@/constants/toasts';
import { BoardUserRoles } from '@/enums/boards/userRoles';
import useCurrentSession from '@/hooks/useCurrentSession';
import {
  createBoardDataState,
  createBoardError,
} from '@/store/createBoard/atoms/create-board.atom';
import { toastState } from '@/store/toast/atom/toast.atom';
import { usersListState } from '@/store/user.atom';

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
          isPageLoading={isPageLoading}
          optionSelected={optionSelected}
          setOptionSelected={setOptionSelected}
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
      setToastState(
        createErrorMessage('Please choose a team in the "Team/-Sub-teams configuration" tab'),
      );
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
      <Text css={{ mb: '$16' }} heading={3}>
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
