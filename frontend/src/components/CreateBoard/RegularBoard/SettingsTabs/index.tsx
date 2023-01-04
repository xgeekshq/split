import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Flex from '@/components/Primitives/Flex';
import Separator from '@/components/Primitives/Separator';
import { createBoardError } from '@/store/createBoard/atoms/create-board.atom';
import { ToastStateEnum } from '@/utils/enums/toast-types';
import { toastState } from '@/store/toast/atom/toast.atom';
import Text from '@/components/Primitives/Text';
import { StyledTextTab } from './styles';
import ParticipantsTab from '../ParticipantsTab';
import BoardConfigurations from '../../Configurations/BoardConfigurations';

const SettingsTabs = () => {
  const [currentTab, setCurrentTab] = useState(1);

  /**
   * Recoil Atoms
   */
  const haveError = useRecoilValue(createBoardError);
  const setToastState = useSetRecoilState(toastState);

  const handleChangeTab = (value: number) => {
    if (haveError) return;
    setCurrentTab(value);
  };

  const {
    formState: { errors },
  } = useFormContext();

  useEffect(() => {
    if (errors.maxVotes) {
      setCurrentTab(2);
    }

    if (errors.team && currentTab === 2) {
      setToastState({
        open: true,
        content: 'Please choose a team in the "Team/-Sub-teams configuration" tab',
        type: ToastStateEnum.ERROR,
      });
    }
  }, [currentTab, errors.maxVotes, errors.team, setToastState]);

  return (
    <Flex direction="column">
      <Text heading={3} css={{ mb: '$8', mt: '$12' }}>
        Settings
      </Text>
      <Flex css={{ width: '100%' }} gap="24">
        <StyledTextTab
          color="primary300"
          data-activetab={currentTab === 1}
          size="md"
          onClick={() => handleChangeTab(1)}
        >
          Participants
        </StyledTextTab>
        <StyledTextTab
          color="primary300"
          data-activetab={currentTab === 2}
          size="md"
          onClick={() => handleChangeTab(2)}
        >
          Configurations
        </StyledTextTab>
      </Flex>
      <Separator
        css={{ position: 'relative', top: '-1px', zIndex: '-1' }}
        orientation="horizontal"
      />

      {currentTab === 1 && <ParticipantsTab />}
      {currentTab === 2 && <BoardConfigurations isRegularBoard />}
    </Flex>
  );
};

export default SettingsTabs;
